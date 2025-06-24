<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoKycSession;
use App\Models\videoKycGuideLine;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class VideoKycController extends Controller
{

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
    $path = $request->file('video')->store('kyc-videos');
    // Optionally, save $path and $request->token to DB
    return response()->json(['success' => true, 'path' => $path]);
}


}
