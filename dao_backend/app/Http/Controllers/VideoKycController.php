<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VideoKycSession;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class VideoKycController extends Controller
{
    public function create(Request $request,$application_id)
{
    $request->validate([
        'application_id' => 'required|string',
        'client_email' => 'required|email',
    ]);

    $token = strtoupper(Str::random(6));

    $session = VideoKycSession::create([
        'application_id' => $request->application_id,
        'client_email' => $request->client_email,
        'token' => $token,
        'expires_at' => now()->addMinutes(30),
    ]);

    return response()->json([
        'token' => $token,
        'join_url' => config('app.frontend_url') . "/video-kyc?token={$token}"
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
