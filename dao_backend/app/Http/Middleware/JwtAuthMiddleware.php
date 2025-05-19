<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token missing'], 401);
        }

        $token = substr($authHeader, 7);
        $secret = 'dev_secret_key';

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $request->merge(['auth_user' => (array) $decoded]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token', 'message' => $e->getMessage()], 401);
        }

        return $next($request);
    }
}
