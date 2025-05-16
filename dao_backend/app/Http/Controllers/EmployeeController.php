<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function getTasks(Request $request)
    {
        $user = $request->get('auth_user');

        return response()->json([
            'tasks' => ['Review documents', 'Verify KYC'],
            'user' => $user,
        ]);
    }
}

