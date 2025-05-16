<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;



class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->get('auth_user');

        if (!$user || !in_array($user['role'], $roles)) {
            return response()->json(['error' => 'Access denied: insufficient role'], 403);
        }

        return $next($request);
    }
}
