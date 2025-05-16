<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function handleAccounts(Request $request)
    {
        $user = $request->get('auth_user');

        return response()->json([
            'message' => "Agent {$user['name']} is handling customer accounts.",
        ]);
    }
}
