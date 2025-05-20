<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerApplicationDetail;
use App\Models\ApplicationPersonalDetails; 

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

        // Normalize gender input to match validation
            $request->merge([
                'gender' => ucfirst(strtolower($request->input('gender')))
            ]);

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

            // Store the inserted ID in the session
        session(['inserted_id' => $customerApplication->id]);

        // $insertedId = session('inserted_id');

        // Return a response
        return response()->json([
            'message' => 'Customer application details saved successfully.',
            'application_no' => $applicationNo,
            'application_id' => $customerApplication->id,
            'data' => $customerApplication,
        ], 201);
    }

   
public function getApplicationDetails(Request $request, $id)
{
    $applicationDetails = CustomerApplicationDetail::find($id);

    if ($applicationDetails) {
        return response()->json([
            'message' => 'Application details retrieved successfully.',
            'data' => $applicationDetails,
        ]);
    } else {
        return response()->json([
            'message' => 'Application details not found.',
        ], 404);
    }
}


// Store personal details
public function storePersonalDetails(Request $request)
{
   $agentId = $request->get('auth_user')['sub'];

// Get the latest application submitted by this agent
$latestApplication = CustomerApplicationDetail::where('agent_id', $agentId)
    ->latest()
    ->first();

if (!$latestApplication) {
    return response()->json([
        'message' => 'No application found for this agent. Please complete the first step.'
    ], 400);
}

$application_id = $latestApplication->id;

$validated = $request->validate([
    'salutation' => 'required|in:MR,MRS',
    'religion' => 'required|in:HINDU,MUSLIM',
    'caste' => 'nullable|string',
    'marital_status' => 'required|in:MARRIED,SINGLE',
    'alt_mob_no' => 'nullable|string',
    'email' => 'nullable|email',
    'adhar_card' => 'nullable|string',
    'pan_card' => 'nullable|string',
    'passport' => 'nullable|string',
    'driving_license' => 'nullable|string',
    'voter_id' => 'nullable|string',
    'status' => 'nullable|in:APPROVED,REJECT',
]);

$validated['application_id'] = $application_id;

$personalDetail = ApplicationPersonalDetails::create($validated);

return response()->json([
    'message' => 'Personal details saved successfully.',
    'data' => $personalDetail,
], 201);
}

// Update personal details
public function updatePersonalDetails(Request $request, $id)
{
    $personalDetail = ApplicationPersonalDetail::find($id);

    if (!$personalDetail) {
        return response()->json(['message' => 'Not found.'], 404);
    }

    $validated = $request->validate([
        'salutation' => 'sometimes|in:MR,MRS',
        'religion' => 'sometimes|in:HINDU,MUSLIM',
        'caste' => 'nullable|string',
        'marital_status' => 'sometimes|in:MARRIED,SINGLE',
        'alt_mob_no' => 'nullable|string',
        'email' => 'nullable|email',
        'adhar_card' => 'nullable|string',
        'pan_card' => 'nullable|string',
        'passport' => 'nullable|string',
        'driving_license' => 'nullable|string',
        'voter_id' => 'nullable|string',
        'status' => 'nullable|in:APPROVED,REJECT',
    ]);

    $personalDetail->update($validated);

    return response()->json([
        'message' => 'Personal details updated successfully.',
        'data' => $personalDetail,
    ]);
}
    
}
