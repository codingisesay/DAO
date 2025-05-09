<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // dd($user);

        if ($user->user_type_id == 1) {
            return response()->json([
                'message' => 'Welcome to the admin dashboard',
                'data' => [
                    // example: stats, users, etc.
                ]
            ]);
        }

        return response()->json([
            'message' => 'Welcome to the user dashboard',
            'data' => [
                // example: profile, settings, etc.
            ]
        ]);
    }
}
