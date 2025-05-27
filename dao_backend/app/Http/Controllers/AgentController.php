<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerApplicationDetail;
use App\Models\ApplicationPersonalDetails; 
use App\Models\ApplicationAddressDetails;
use App\Models\ApplicantLivePhoto;
use App\Models\ApplicationDocument;
use App\Models\AccountPersonalDetail;
use App\Models\AccountNominee;
use App\Models\ServiceToCustomer;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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
            'landmark' => 'nullable|string',
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
    // $request->merge(['application_id' => 1]); // Replace 4 with a valid ID from your DB

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

    // Update if exists, otherwise create
    $personalDetails = \App\Models\ApplicationPersonalDetails::updateOrCreate(
        ['application_id' => $validated['application_id']],
        $validated
    );

    return response()->json([
        'message' => 'Personal details saved successfully.',
        'data' => $personalDetails,
    ], 201);
}


// Store address details
public function saveAddressDetails(Request $request)
{
    // Hardcode application_id for testing
    // $request->merge(['application_id' => 1]); // Replace 4 with a valid ID

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
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

    // Update if exists, otherwise create
    $addressDetails = \App\Models\ApplicationAddressDetails::updateOrCreate(
        ['application_id' => $validated['application_id']],
        $validated
    );

    return response()->json([
        'message' => 'Address details saved successfully.',
        'data' => $addressDetails,
    ], 201);
}

// Store live photo
public function saveLivePhoto(Request $request)
{
    // Hardcode application_id as 6 for testing
    // $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'longitude' => 'nullable|string|max:191',
        'latitude' => 'nullable|string|max:191',
        'status' => 'nullable|in:APPROVED,REJECT',
        'photo' => 'required|image|max:5120', // max 5MB
    ]);

    $file = $request->file('photo');
    $filename = uniqid('livephoto_') . '.' . $file->getClientOriginalExtension();
    $path = $file->storeAs('live_photos', $filename, 'public');

    // Update if exists, otherwise create
    $photo = ApplicantLivePhoto::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
        ],
        [
            'application_id' => $validated['application_id'],
            'longitude' => $validated['longitude'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'name' => $filename,
            'path' => $path,
            'status' => $validated['status'] ?? null,
        ]
    );

    return response()->json([
        'message' => 'Live photo uploaded successfully.',
        'data' => $photo,
    ], 201);
}

// Store application document
public function saveApplicationDocument(Request $request)
{
    // Hardcode application_id for testing if needed
    // $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'document_types' => 'required|array|min:1',
        'document_types.*' => 'required|string|max:191',
        'files' => 'required|array|min:1',
        'files.*' => 'file|max:10240',
    ]);

    $documents = [];
   foreach ($validated['files'] as $index => $file) {
    $documentType = $validated['document_types'][$index] ?? null;
    $filename = uniqid('doc_') . '.' . $file->getClientOriginalExtension();
    $path = $file->storeAs('application_documents', $filename, 'public');

    ApplicationDocument::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
            'document_type' => $documentType,
        ],
        [
            'application_id' => $validated['application_id'],
            'document_type' => $documentType,
            'file_name' => $filename,
            'file_path' => $path,
            'status' => $validated['status'] ?? null,
        ]
    );

    return response()->json([
        'message' => 'Documents uploaded successfully.',
        'data' => $documents,
    ], 201);
}

}
// Store account personal details
public function saveAccountPersonalDetails(Request $request)
{
    // Hardcode application_id for testing if needed
    // $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'father_prefix_name' => 'required|in:MR,MRS',
        'father_first_name' => 'required|string|max:191',
        'father_middle_name' => 'nullable|string|max:191',
        'father_last_name' => 'nullable|string|max:191',
        'mother_prefix_name' => 'required|in:MR,MRS',
        'mother_first_name' => 'required|string|max:191',
        'mother_middle_name' => 'nullable|string|max:191',
        'mother_last_name' => 'nullable|string|max:191',
        'birth_place' => 'nullable|string|max:191',
        'birth_country' => 'nullable|string|max:191',
        'occoupation_type' => 'nullable|string|max:191',
        'occupation_name' => 'nullable|string|max:191',
        'if_salaryed' => 'nullable|in:YES,NO',
        'designation' => 'nullable|string|max:191',
        'nature_of_occoupation' => 'nullable|string|max:191',
        'qualification' => 'nullable|string|max:191',
        'anual_income' => 'nullable|string|max:191',
        'remark' => 'nullable|string|max:191',
        'status' => 'nullable|in:APPROVED,REJECT',
    ]);

    // Update if exists, otherwise create
    $accountPersonalDetail = AccountPersonalDetail::updateOrCreate(
        ['application_id' => $validated['application_id']],
        $validated
    );

    return response()->json([
        'message' => 'Account personal details saved successfully.',
        'data' => $accountPersonalDetail,
    ], 201);
}

// Store account nominee details
public function saveAccountNominee(Request $request)
{
    // Hardcode application_id for testing if needed
    // $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'salutation' => 'required|in:MR,MRS,MISS',
        'first_name' => 'required|string|max:191',
        'middle_name' => 'nullable|string|max:191',
        'last_name' => 'nullable|string|max:191',
        'relationship' => 'required|string|max:191',
        'percentage' => 'required|string|max:191',
        'dob' => 'required|date',
        'age' => 'required|string|max:191',
        'nom_complex_name' => 'nullable|string|max:191',
        'nom_flat_no' => 'nullable|string|max:191',
        'nom_area' => 'nullable|string|max:191',
        'nom_landmark' => 'nullable|string|max:191',
        'nom_country' => 'nullable|string|max:191',
        'nom_pincode' => 'nullable|string|max:191',
        'nom_city' => 'nullable|string|max:191',
        'nom_state' => 'nullable|string|max:191',
        'nom_district' => 'nullable|string|max:191',
        'nom_mobile' => 'nullable|string|max:191',
        'status' => 'nullable|in:APPROVED,REJECT',
    ]);

    // Use a combination of fields to avoid duplicate nominees for the same application
    $nominee = AccountNominee::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
            'first_name' => $validated['first_name'],
            'dob' => $validated['dob'],
        ],
        $validated
    );

    return response()->json([
        'message' => 'Account nominee saved successfully.',
        'data' => $nominee,
    ], 201);
}

// Store service to customer
public function saveServiceToCustomer(Request $request)
{
    // Hardcode application_id for testing if needed
    $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'banking_services_id' => 'required|integer|exists:banking_services,id',
    ]);

    // Update if exists, otherwise create
    $service = ServiceToCustomer::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
            'banking_services_id' => $validated['banking_services_id'],
        ],
        $validated
    );

    return response()->json([
        'message' => 'Service to customer saved successfully.',
        'data' => $service,
    ], 201);
}

// Fetch full application details
public function getFullApplicationDetails($applicationId)
{
    // Hardcode application_id for testing
    $applicationId = 1; // <-- Hardcoded for testing

    // Fetch from customer_application_details
    $application = DB::table('customer_application_details')
        ->where('id', $applicationId)
        ->first();

    // Fetch from application_personal_details
    $personalDetails = DB::table('application_personal_details')
        ->where('application_id', $applicationId)
        ->first();

    // Fetch from account_personal_details
    $accountPersonalDetails = DB::table('account_personal_details')
        ->where('application_id', $applicationId)
        ->first();

    // Fetch from account_nominees (can be multiple)
    $accountNominees = DB::table('account_nominees')
        ->where('application_id', $applicationId)
        ->get();

    if (!$application) {
        return response()->json(['message' => 'Application not found'], 404);
    }

    return response()->json([
        'message' => 'Application details fetched successfully.',
        'data' => [
            'application' => $application,
            'personal_details' => $personalDetails,
            'account_personal_details' => $accountPersonalDetails,
            'account_nominees' => $accountNominees,
        ]
    ]);
}
}