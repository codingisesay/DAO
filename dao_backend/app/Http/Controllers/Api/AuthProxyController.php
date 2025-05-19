<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthProxyController extends Controller
{
    public function login(Request $request)
    {
        $authServiceUrl = env('AUTH_SERVICE_URL') . '/auth/api/login';

        // dd($authServiceUrl);

        // Forward the login request to the auth microservice
        // $response = Http::post($authServiceUrl, $request->only('email', 'password'));
        $response = Http::post($authServiceUrl, $request->only('email', 'password'));

        

        if ($response->successful()) {
            $token = $response->json()['token'] ?? null;

            if ($token) {
                // Save token to Laravel session
                Session::put('jwt_token', $token);

                // Return token to the frontend
                return response()->json(['token' => $token]);
            }
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
