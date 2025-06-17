<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoKycSession;
use App\Models\videoKycGuideLine;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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
        'client_email' => 'required',
    ]);

    $token = strtoupper(Str::random(6));

    $session = VideoKycSession::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
            'client_email' => $validated['client_email'],
        ],
        [
            'token' => $token,
            'status' => 'pending',
            'expires_at' => now()->addMinutes(30),
        ]
    );

    // Prepare join URL
    $joinUrl = config('app.frontend_url') . "/video-kyc?token={$token}";

    // Send mail
    \Mail::raw(
        "Your Video KYC session has been created. Please join using this link: {$joinUrl}",
        function ($message) use ($validated) {
            $message->to($validated['client_email'])
                    ->subject('Your Video KYC Session Link');
        }
    );

    return response()->json([
        'success' => true,
        'application_id' => $session->application_id,
        'token' => $session->token,
        'client_email' => $session->client_email,
        'join_url' => $joinUrl,
        'expires_at' => $session->expires_at,
    ]);
}

public function upload(Request $request)
{
    $request->validate([
        'token' => 'required|string',
        'video' => 'required|file|mimes:webm,mp4|max:500000'
    ]);

    $session = VideoKycSession::where('token', $request->token)->firstOrFail();

    $path = $request->file('video')->store("video_kyc/{$session->application_id}", 'public'); // or 's3'

    $session->update([
        'recording_url' => Storage::url($path),
        'status' => 'completed',
    ]);

    return response()->json(['message' => 'Video uploaded', 'url' => Storage::url($path)]);
}


}
