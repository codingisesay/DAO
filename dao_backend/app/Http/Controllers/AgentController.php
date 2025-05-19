<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerApplicationDetail;

class AgentController extends Controller
{
    public function handleAccounts(Request $request)
    {
        $user = $request->get('auth_user');

        // dd($user);

        return response()->json([
            // 'message' => "Agent {$user['name']} is handling customer accounts.",
            'message' => $user,
        ]);
    }


    public function EnrollmentDetails(Request $request)
    {
        $user = $request->get('auth_user');
        // Validate incoming request data (excluding application_no since it will be generated)
        $validatedData = $request->validate([
            'auth_type' => 'nullable|in:Pan Card,Aadhar Card,Digilocker',
            'auth_code' => 'nullable|string',
            'auth_status' => 'nullable|string',
            'first_name' => 'nullable|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'DOB' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female,Others',
            'mobile' => 'nullable|string',
            'complex_name' => 'nullable|string',
            'flat_no' => 'nullable|string',
            'area' => 'nullable|string',
            'lankmark' => 'nullable|string',
            'country' => 'nullable|string',
            'pincode' => 'nullable|string',
            'city' => 'nullable|string',
            'district' => 'nullable|string',
            'state' => 'nullable|string',
        ]);

        // Generate a unique application number
        $applicationNo = 'APP' . strtoupper(uniqid());

        // Add the generated application number to the validated data
        $validatedData['application_no'] = $applicationNo;
        // Add the agent ID to the validated data from  the authenticated user
        $validatedData['agent_id'] = $user['sub'];

        // Insert data into the database
        $customerApplication = CustomerApplicationDetail::create($validatedData);

        // Return a response
        return response()->json([
            'message' => 'Customer application details saved successfully.',
            'application_no' => $applicationNo,
            'data' => $customerApplication,
        ], 201);
    }
}
