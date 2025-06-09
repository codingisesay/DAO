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
use App\Models\AgentLivePhoto;
use App\Models\CustomerApplicationStatus;

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
        'landmark' => 'nullable',
        'country' => 'nullable|string',
        'pincode' => 'nullable|string', 
        'city' => 'nullable|string',
        'district' => 'nullable|string',
        'state' => 'nullable|string',
        'status' => 'nullable',
    ]);

    // Add the agent ID to the validated data from the authenticated user
    $validatedData['agent_id'] = 1;

    // Try to find an existing application by auth_type + auth_code
    $existingApplication = CustomerApplicationDetail::where('auth_type', $validatedData['auth_type'] ?? null)
        ->where('auth_code', $validatedData['auth_code'] ?? null)
        ->first();

    if ($existingApplication) {
        // Update the existing application
        $existingApplication->update($validatedData);
        $applicationNo = $existingApplication->application_no;
        $applicationId = $existingApplication->id;
        $customerApplication = $existingApplication;
        $message = 'Customer application details updated successfully.';
    } else {
        // Generate a unique application number
        $applicationNo = 'APP' . strtoupper(uniqid());
        $validatedData['application_no'] = $applicationNo;

        // Insert data into the database
        $customerApplication = CustomerApplicationDetail::create($validatedData);
        $applicationId = $customerApplication->id;
        $message = 'Customer application details saved successfully.';
    }

    return response()->json([
        'message' => $message,
        'application_no' => $applicationNo,
        'application_id' => $applicationId,
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



public function savePersonalDetails(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'salutation' => 'required',
        'religion' => 'required',
        'caste' => 'nullable|string|max:191',
        'marital_status' => 'required',
        'alt_mob_no' => 'nullable|string|max:191',
        'email' => 'nullable|email|max:191',
        'adhar_card' => 'nullable|string|max:191',
        'pan_card' => 'nullable|string|max:191',
        'passport' => 'nullable|string|max:191',
        'driving_license' => 'nullable|string|max:191',
        'voter_id' => 'nullable|string|max:191',
        'status' => 'nullable',
    ]);

    $personalDetails = \App\Models\ApplicationPersonalDetails::where('application_id', $validated['application_id'])->first();

    if ($personalDetails) {
        $personalDetails->update($validated);
    } else {
        $personalDetails = \App\Models\ApplicationPersonalDetails::create($validated);
    }

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
        'cor_complex_name' => 'nullable|string|max:191',
        'cor_flat_no' => 'nullable|string|max:191',
        'cor_area' => 'nullable|string|max:191',
        'cor_landmark' => 'nullable|string|max:191',
        'cor_country' => 'nullable|string|max:191',
        'cor_pincode' => 'nullable|string|max:191',
        'cor_city' => 'nullable|string|max:191',
        'cor_district' => 'nullable|string|max:191',
        'cor_state' => 'nullable|string|max:191',
        'per_resident'=> 'nullable',
        'per_residence_status'=> 'nullable',
        'resi_doc'=>'nullable',
        'status' => 'nullable',
    ]);

        $validated['status'] = 'Pending';

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
        'status' => 'nullable',
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


public function saveAgentLivePhoto(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'longitude' => 'required|string|max:255', // match DB
        'latitude' => 'required|string|max:255',  // match DB
        'status' => 'nullable|in:Pending,Approved,Reject,Review', // match DB enum
        'status_comment' => 'nullable|string|max:255',
        'photo' => 'required|image|max:5120', // max 5MB
    ]);

    $file = $request->file('photo');
    $filename = uniqid('livephoto_') . '.' . $file->getClientOriginalExtension();
    $path = $file->storeAs('agent_live_photos', $filename, 'public');

    $photo = AgentLivePhoto::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
        ],
        [
            'application_id' => $validated['application_id'],
            'longitude' => $validated['longitude'],
            'latitude' => $validated['latitude'],
            'name' => $filename,
            'path' => $path,
            'status' => $validated['status'] ?? null,
            'status_comment' => $validated['status_comment'] ?? null,
        ]
    );

    $customerStaus = CustomerApplicationStatus::updateOrCreate([
        'application_id' => $validated['application_id'],
        'status' => 'Pending',
   ] );

   if($customerStaus){

     return response()->json([
        'message' => 'Agent Live photo uploaded successfully.',
        'data' => $photo,
    ], 201);

   }

    return response()->json([
        'message' => 'Error uploading agent live photo.',
        
    ]);
}





 
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

        $doc = ApplicationDocument::updateOrCreate(
            [
                'application_id' => $validated['application_id'],
                'document_type' => $documentType,
            ],
            [
                'application_id' => $validated['application_id'],
                'document_type' => $documentType,
                'file_name' => $filename,
                'file_path' => $path,
            ]
        );

        $documents[] = $doc;
    }
        
        DB::table('document_approved_status')->updateOrInsert(
            ['application_id' => $validated['application_id']],
            ['status' => 'Pending']
        );

    return response()->json([
        'message' => 'Documents uploaded successfully.',
        'data' => $documents,
    ], 201);
}






// Store account personal details
public function saveAccountPersonalDetails(Request $request)
{
    // Hardcode application_id for testing if needed
    // $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'maiden_prefix'=> 'nullable',
        'maiden_first_name'=>  'nullable',
        'maiden_middle_name'=>  'nullable',
        'maiden_last_name'=>  'nullable',
 
        'father_prefix_name' => 'required|',
        'father_first_name' => 'required|string|max:191',
        'father_middle_name' => 'nullable|string|max:191',
        'father_last_name' => 'nullable|string|max:191',
        'father_prefix_name' => 'required|',
        'father_first_name' => 'required|string|max:191',
        'father_middle_name' => 'nullable|string|max:191',
        'father_last_name' => 'nullable|string|max:191',

        'mother_prefix_name' => 'required',
        'mother_first_name' => 'required|string|max:191',
        'mother_middle_name' => 'nullable|string|max:191',
        'mother_last_name' => 'nullable|string|max:191',
        'birth_place' => 'nullable|string|max:191',
        'birth_country' => 'nullable|string|max:191',
        'occoupation_type' => 'nullable|string|max:191',
        'occupation_name' => 'nullable|string|max:191',
        'if_salaryed' => 'nullable',
        'designation' => 'nullable|string|max:191',
        'nature_of_occoupation' => 'nullable|string|max:191',
        'qualification' => 'nullable|string|max:191',
        'anual_income' => 'nullable|string|max:191',
        'remark' => 'nullable|string|max:191',
        'status' => 'nullable',
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





public function saveAccountNominee(Request $request)
{
    // Expecting 'nominees' to be an array of nominee data
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'nominees' => 'array|min:1',
        'nominees.*.salutation' => 'required',
        'nominees.*.first_name' => 'required|string|max:191',
        'nominees.*.middle_name' => 'nullable|string|max:191',
        'nominees.*.last_name' => 'nullable|string|max:191',
        'nominees.*.relationship' => 'required|string|max:191',
        'nominees.*.percentage' => 'required|string|max:191',
        'nominees.*.dob' => 'required|date',
        'nominees.*.age' => 'required|string|max:191',
        'nominees.*.nom_complex_name' => 'nullable|string|max:191',
        'nominees.*.nom_flat_no' => 'nullable|string|max:191',
        'nominees.*.nom_area' => 'nullable|string|max:191',
        'nominees.*.nom_landmark' => 'nullable|string|max:191',
        'nominees.*.nom_country' => 'nullable|string|max:191',
        'nominees.*.nom_pincode' => 'nullable|string|max:191',
        'nominees.*.nom_city' => 'nullable|string|max:191',
        'nominees.*.nom_state' => 'nullable|string|max:191',
        'nominees.*.nom_district' => 'nullable|string|max:191',
        'nominees.*.nom_mobile' => 'nullable|string|max:191',
    ]);

    $savedNominees = [];
    foreach ($validated['nominees'] as $nomineeData) {
        $nomineeData['application_id'] = $validated['application_id'];
        $nominee = AccountNominee::updateOrCreate(
            [
                'application_id' => $validated['application_id'],
                'first_name' => $nomineeData['first_name'],
                'dob' => $nomineeData['dob'],
            ],
            $nomineeData
        );
        $savedNominees[] = $nominee;
    }
DB::table('nominee_approved_status')->updateOrInsert(
    ['application_id' => $validated['application_id']],
    ['status' => 'Pending']
);

    return response()->json([
        'message' => 'Account nominees saved successfully.',
        'data' => $savedNominees,
    ], 201);
}


// Store service to customer
public function saveServiceToCustomer(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'banking_services_facilities_id' => 'required|array',
        'banking_services_facilities_id.*' => 'required|integer|exists:banking_services_facilities,id',
    ]);

    $saved = [];
    foreach ($validated['banking_services_facilities_id'] as $facilityId) {
        $service = ServiceToCustomer::updateOrCreate(
            [
                'application_id' => $validated['application_id'],
                'banking_services_facilities_id' => $facilityId,
            ],
            [
                'application_id' => $validated['application_id'],
                'banking_services_facilities_id' => $facilityId,
            ]
        );
        $saved[] = $service;
    }

    return response()->json([
        'message' => 'Services to customer saved successfully.',
        'data' => $saved,
    ], 201);
}

// Fetch full application details
public function getFullApplicationDetails($applicationId)
{
  

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

       
    $applicationAddresss = DB::table('application_address_details')
        ->where('application_id', $applicationId)
        ->get();
        
    // Fetch from account_nominees (can be multiple) // application_documents
    $custlivepic = DB::table('applicant_live_photos')
        ->where('application_id', $applicationId)
        ->get()  
        
        ;
 
    // Fetch from account_nominees (can be multiple) // application_documents
    $custumerdoc = DB::table('application_documents')
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
            'customerpic' => $custlivepic,
            'customerdoc' => $custumerdoc,
        ]
    ]);
}

public function getApplicationByAadhar(Request $request)
{
    $request->validate([
        'auth_code' => 'required|string'
    ]);

    $application = \DB::table('customer_application_details')
        ->where('auth_type', 'Aadhar Card')
        ->where('auth_code', $request->auth_code)
        ->first();

    if (!$application) {
        return response()->json(['message' => 'No application found for this Aadhaar number.'], 404);
    }

    // Optionally fetch related details as in getFullApplicationDetails
    return response()->json([
        'message' => 'Application found.',
        'data' => $application
    ]);
}

public function getBankingServices()
{
    // Join banking_services with banking_services_facilities
    $bankingServices = DB::table('banking_services')
        ->leftJoin('banking_services_facilities', 'banking_services.id', '=', 'banking_services_facilities.banking_service_id')
        ->select(
            'banking_services.id as service_id',
            'banking_services.name as service_name',
            'banking_services.status as service_status',
            'banking_services.created_at as service_created_at',
            'banking_services.updated_at as service_updated_at',
            'banking_services_facilities.id as facility_id',
            'banking_services_facilities.name as facility_name',
            'banking_services_facilities.status as facility_status',
            'banking_services_facilities.banking_service_id'
        )
        ->get();

    if ($bankingServices->isEmpty()) {
        return response()->json(['message' => 'No banking services found.'], 404);
    }

    return response()->json([
        'message' => 'Banking services fetched successfully.',
        'data' => $bankingServices,
    ]);
}

public function getApplicationStatusByAgents($agent_id)
{
    $statuses = ['Pending', 'Approved', 'Reject', 'Review'];

    $applications = DB::table('customer_application_details')
        ->join('customer_appliction_status', 'customer_application_details.id', '=', 'customer_appliction_status.application_id')
        ->where('customer_application_details.agent_id', $agent_id)
        ->whereIn('customer_appliction_status.status', $statuses)
        ->select(
            'customer_application_details.*',
            'customer_appliction_status.status as application_status',
            
        )
        ->get();

    if ($applications->isEmpty()) {
        return response()->json(['message' => 'No applications found for this agent.'], 404);
    }

    return response()->json([
        'message' => 'Application statuses fetched successfully.',
        'data' => $applications,
    ]);
}


public function getFullApplicationsByAgent($agent_id)
{
    // Fetch all applications for the agent
    $applications = DB::table('customer_application_details')
        ->where('agent_id', $agent_id)
        ->get();

    if ($applications->isEmpty()) {
        return response()->json(['message' => 'No applications found for this agent.'], 404);
    }

    $result = [];

    foreach ($applications as $application) {
        $applicationId = $application->id;

        $personalDetails = DB::table('application_personal_details')
            ->where('application_id', $applicationId)
            ->first();

        $accountPersonalDetails = DB::table('account_personal_details')
            ->where('application_id', $applicationId)
            ->first();

        $accountNominees = DB::table('account_nominees')
            ->where('application_id', $applicationId)
            ->get();

        $applicationAddresss = DB::table('application_address_details')
            ->where('application_id', $applicationId)
            ->get();

        $custlivepic = DB::table('applicant_live_photos')
            ->where('application_id', $applicationId)
            ->get();

        $custumerdoc = DB::table('application_documents')
            ->where('application_id', $applicationId)
            ->get();

        $result[] = [
            'application' => $application,
            'personal_details' => $personalDetails,
            'account_personal_details' => $accountPersonalDetails,
            'account_nominees' => $accountNominees,
            'application_address' => $applicationAddresss,
            'customerpic' => $custlivepic,
            'customerdoc' => $custumerdoc,
        ];
    }

    return response()->json([
        'message' => 'Applications for agent fetched successfully.',
        'data' => $result,
    ]);
}

}