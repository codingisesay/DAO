<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerApplicationDetail;
use App\Models\ApplicationPersonalDetails; 
use App\Models\ApplicationAddressDetails;

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
        // $user = $request->get('auth_user');

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
        $validatedData['agent_id'] = 1;

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
public function savePersonalDetails(Request $request)
{
    // Hardcode application_id for testing
    $request->merge(['application_id' => 31]); // Replace 1 with a valid ID from your DB

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'salutation' => 'required|in:MR,MRS',
        'religion' => 'required|in:HINDU,MUSLIM',
        'caste' => 'nullable|string|max:191',
        'marital_status' => 'required|in:MARRIED,SINGLE',
        'alt_mob_no' => 'nullable|string|max:191',
        'email' => 'nullable|email|max:191',
        'adhar_card' => 'nullable|string|max:191',
        'pan_card' => 'nullable|string|max:191',
        'passport' => 'nullable|string|max:191',
        'driving_license' => 'nullable|string|max:191',
        'voter_id' => 'nullable|string|max:191',
        'status' => 'nullable|in:APPROVED,REJECT',
    ]);

    $personalDetails = ApplicationPersonalDetails::create($validated);

    return response()->json([
        'message' => 'Personal details saved successfully.',
        'data' => $personalDetails,
    ], 201);
}


// Store address details
public function saveAddressDetails(Request $request)
{
    // Hardcode application_id for testing
    $request->merge(['application_id' => 4]); // Replace 4 with a valid ID

    $validated = $request->validate([
        'application_id' => 'integer|exists:customer_application_details,id',
        'per_complex_name' => 'string|max:191',
        'per_flat_no' => 'string|max:191',
        'per_area' => 'string|max:191',
        'per_landmark' => 'string|max:191',
        'per_country' => 'string|max:191',
        'per_pincode' => 'string|max:191',
        'per_city' => 'string|max:191',
        'per_district' => 'string|max:191',
        'per_state' => 'string|max:191',
        'cor_complex' => 'nullable|string|max:191',
        'cor_flat_no' => 'nullable|string|max:191',
        'cor_area' => 'nullable|string|max:191',
        'cor_landmark' => 'nullable|string|max:191',
        'cor_country' => 'nullable|string|max:191',
        'cor_pincode' => 'nullable|string|max:191',
        'cor_city' => 'nullable|string|max:191',
        'cor_district' => 'nullable|string|max:191',
        'cor_state' => 'nullable|string|max:191',
        'status' => 'nullable|in:APPROVED,REJECT',
    ]);

    $addressDetails = ApplicationAddressDetails::create($validated);

    return response()->json([
        'message' => 'Address details saved successfully.',
        'data' => $addressDetails,
    ], 201);
}
}