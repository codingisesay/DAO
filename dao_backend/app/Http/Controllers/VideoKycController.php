<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoKycSession;
use App\Models\videoKycGuideLine;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="DAO Backend API",
 *     description="This is the API documentation for the DAO application"
 * )
 *
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Local Server"
 * )
 */

class VideoKycController extends Controller
{

    /**
 * @OA\Get(
 *     path="/api/auth/login",
 *     summary="Login User",
 *     @OA\Response(
 *         response=200,
 *         description="Successful login"
 *     )
 * )
 */

  public function acceptKycGuidline(Request $request,$application_id){

    $validated = $request->validate([
        'application_id' => 'required',
        'status' => 'required',
    ]);

     $videoKycStatus = videoKycGuideLine::updateOrCreate([
        'application_id' => $validated['application_id'],
        'status' => 'checked',
   ] );

   if($videoKycStatus){

     return response()->json([
        'success' => "Guide Line Status Saved !!",
        
    ]);



   }

  return response()->json([
        'error' => "Error While Saving GuideLine Status",
        
    ]);

  }


public function create(Request $request, $application_id)
{
    $validated = $request->validate([
        'application_id' => 'required',
        // 'client_email' => 'required|email', // Uncomment if you want to validate email
    ]);

    $token = strtoupper(Str::random(6));

    // --- Database insertion is commented out ---
    $session = VideoKycSession::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
        ],
        [
            'token' => $token,
            'status' => 'pending',
            'expires_at' => now()->addMinutes(30),
        ]
    );

    // Prepare join URL
    $joinUrl = config('app.frontend_url') . "/startVkyc?token={$token}";

    $applicationDetails = DB::table('application_personal_details')->where('application_id', $validated['application_id'])->first();

    // --- Mail sending is commented out ---
   \Mail::raw(
        "Your Video KYC session has been created. Please join using this link: {$joinUrl}",
        function ($message) use ($validated, $applicationDetails) {
            $message->to($applicationDetails->email)
                    ->subject('Your Video KYC Session Link');
        }
    );
    return response()->json([
        'success' => true,
        'application_id' => $session->application_id,
        'token' => $session->token,
        'join_url' => $joinUrl,
        'expires_at' => $session->expires_at,
        'data' => $applicationDetails
    ]);
}


public function validateToken(Request $request)
{
    $token = $request->query('token');

    $session = VideoKycSession::where('token', $token)->first();

    if (!$session || $session->expires_at->isPast()) {
        return response()->json(['valid' => false, 'message' => 'Token expired or invalid'], 401);
    }

    return response()->json(['valid' => true, 'application_id' => $session->application_id]);
}


public function upload(Request $request)
{
    $request->validate([
        'video' => 'required|file|mimes:webm,mp4,mov,avi|max:500000',
        'token' => 'required'
    ]);

    // Store the uploaded video
    $path = $request->file('video')->store('kyc-videos');

    // Update the recording_url in VideoKycSession where token matches
    $session = \App\Models\VideoKycSession::where('token', $request->token)->first();
    if ($session) {
        $session->recording_url = $path;
        $session->status = 'completed'; // Optionally mark as completed
        $session->save();
    }

    return response()->json([
        'success' => true,
        'path' => $path,
        'updated' => (bool)$session
    ]);
}

public function scheduleVideoCall(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required',
        'agent_id' => 'required',
        'link_status' => 'required',
        'schedule_date' => 'required|date',
        'schedule_start_time' => 'required',
        'schedule_end_time' => 'required',
    ]);

    // Prevent same start and end time
    if ($validated['schedule_start_time'] === $validated['schedule_end_time']) {
        return response()->json([
            'message' => 'Start time and end time cannot be the same.'
        ], 422);
    }

    // Prevent duplicate schedule for same application, agent, and time
    $exists = DB::table('video_call_schedule')
        ->where('application_id', $validated['application_id'])
        ->where('agent_id', $validated['agent_id'])
        ->where('schedule_date', $validated['schedule_date'])
        ->where('schedule_start_time', $validated['schedule_start_time'])
        ->where('schedule_end_time', $validated['schedule_end_time'])
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'A schedule with the same details already exists.'
        ], 409);
    }

   // Prevent overlapping schedules for the same agent
$overlap = DB::table('video_call_schedule')
    ->where('agent_id', $validated['agent_id'])
    ->where('schedule_date', $validated['schedule_date'])
    ->where(function ($query) use ($validated) {
        $query->where(function ($q) use ($validated) {
            $q->where('schedule_start_time', '<', $validated['schedule_end_time'])
              ->where('schedule_end_time', '>', $validated['schedule_start_time']);
        });
    })
    ->exists();

if ($overlap) {
    return response()->json([
        'message' => 'This agent already has a schedule that overlaps with the selected time.'
    ], 409);
}

    // Insert the schedule
    $schedule = DB::table('video_call_schedule')->insertGetId([
        'application_id' => $validated['application_id'],
        'agent_id' => $validated['agent_id'],
        'link_status' => $validated['link_status'],
        'schedule_date' => $validated['schedule_date'],
        'schedule_start_time' => $validated['schedule_start_time'],
        'schedule_end_time' => $validated['schedule_end_time'],
    ]);

    return response()->json([
        'message' => 'Video call scheduled successfully.',
        'id' => $schedule
    ], 201);
}

}


