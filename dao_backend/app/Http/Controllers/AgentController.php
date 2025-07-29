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


public function getAccountStatusByAgent(Request $request)
{
    $agentId = $request->input('agent_id');

    // Base query with join
    $baseQuery = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->select(
            'cas.*',
            'cad.agent_id',
            'cad.application_no',
            'cad.first_name',
            'cad.last_name'
        );

    // Clone for reuse in both queries
    $statusQuery = clone $baseQuery;
    $countQuery = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->select('cas.status', DB::raw('COUNT(*) as total'))
        ->groupBy('cas.status');

    if (!empty($agentId)) {
        $baseQuery->where('cad.agent_id', $agentId);
        $countQuery->where('cad.agent_id', $agentId);
    }

    $statuses = $baseQuery->get();
    $statusCounts = $countQuery->get();

    return response()->json([
        'data' => $statuses,
        'summary' => $statusCounts
    ], 200);
}


 
public function EnrollmentDetails(Request $request)
{
    $request->merge([
        'gender' => ucfirst(strtolower($request->input('gender')))
    ]);

    $validatedData = $request->validate([
        'agent_id' => 'required',
        'auth_type' => 'nullable|in:Pan Card,Aadhaar Card,Digilocker',
        'auth_code' => 'nullable|string',
        'auth_status' => 'nullable|string',
        'first_name' => 'nullable|string',
        'middle_name' => 'nullable|string',
        'last_name' => 'nullable|string',
        'DOB' => 'nullable|date',
        'gender' => 'nullable',
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

    // Use agent_id from payload
    // $validatedData['agent_id'] = $request->input('agent_id');

 $existingApplication = CustomerApplicationDetail::where('auth_type', $validatedData['auth_type'] ?? null)
    ->where('auth_code', $validatedData['auth_code'] ?? null)
    ->first();

    // Check if an existing application with the same auth_type and auth_code exists
if ($existingApplication) {
    $existingApplication->update($validatedData);
    $applicationNo = $existingApplication->application_no ?? null;
    $applicationId = $existingApplication->id ?? null;
    $customerApplication = $existingApplication;
    $message = 'Customer application details updated successfully.';
} else {
    $applicationNo = 'APP' . strtoupper(uniqid());
    $validatedData['application_no'] = $applicationNo;
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
        //
        'firstname' => 'nullable',
        'middlename' => 'nullable',
        'lastname' => 'nullable',
        'dateofbirth' => 'nullable',
        'gender' => 'nullable',
        
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
        'per_complex_name' => 'nullable',
        'per_flat_no' => 'nullable',
        'per_area' => 'nullable',
        'per_landmark' => 'nullable',
        'per_country' => 'nullable',
        'per_pincode' => 'nullable',
        'per_city' => 'nullable',
        'per_district' => 'nullable',
        'per_state' => 'nullable',
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

public function saveLivePhoto(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'longitude' => 'nullable|string|max:191',
        'latitude' => 'nullable|string|max:191',
        'address' => 'nullable',
        'status' => 'nullable',
        'status_comment' => 'nullable|string|max:255',
        'photo' => 'required|image|max:5120', // max 5MB
    ]);

    $file = $request->file('photo');
    $filename = uniqid('livephoto_') . '.' . $file->getClientOriginalExtension();
    $binaryContent = file_get_contents($file->getRealPath());

    // Update if exists, otherwise create
    $photo = ApplicantLivePhoto::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
        ],
        [
            'application_id' => $validated['application_id'],
            'longitude' => $validated['longitude'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'address' => $validated['address'] ?? null,
            'name' => $filename,
            'path' => $binaryContent, // Save as mediumblob
            'status' => $validated['status'] ?? null,
            'status_comment' => $validated['status_comment'] ?? null,
        ]
    );

    return response()->json([
        'message' => 'Live photo uploaded successfully.',
       'data' => $photo->makeHidden(['path']),
    ], 201);
}


public function saveAgentLivePhoto(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required',
        'longitude' => 'required|string|max:255',
        'latitude' => 'required|string|max:255',
        'address' => 'nullable',
        'status' => 'nullable',
        'status_comment' => 'nullable|string|max:255',
        'photo' => 'required|image|max:5120', // max 5MB 
    ]);

    $file = $request->file('photo');
    $filename = uniqid('livephoto_') . '.' . $file->getClientOriginalExtension();
    $binaryContent = file_get_contents($file->getRealPath());

    $photo = AgentLivePhoto::updateOrCreate(
        [
            'application_id' => $validated['application_id'],
        ],
        [
            'application_id' => $validated['application_id'],
            'longitude' => $validated['longitude'],
            'latitude' => $validated['latitude'],
            'address' => $validated['address'] ?? null,
            'name' => $filename,
            'path' => $binaryContent, // Save as mediumblob
            'status' => $validated['status'] ?? null,
            'status_comment' => $validated['status_comment'] ?? null,
        ]
    );

   $customerStaus = CustomerApplicationStatus::updateOrCreate(
    ['application_id' => $validated['application_id']],
    ['status' => 'Pending']
);

    if ($customerStaus) {
        return response()->json([
            'message' => 'Agent Live photo uploaded successfully.',
            'data' => $photo->makeHidden(['path']),
        ], 201);
    }

    return response()->json([
        'message' => 'Error uploading agent live photo.',
    ]);
}



// public function saveApplicationDocument(Request $request)
// {
//     $validated = $request->validate([
//         'application_id' => 'required|integer|exists:customer_application_details,id',
//         'document_types' => 'required|array|min:1',
//         'document_types.*' => 'required|string|max:191',
//         'files' => 'required|array|min:1',
//         'files.*' => 'required|string', // Expecting base64 string
//     ]);

//     // 1. Delete all existing documents for this application_id
//     \App\Models\ApplicationDocument::where('application_id', $validated['application_id'])->delete();

//     // 2. Insert new documents
//     $documents = [];
//     foreach ($validated['files'] as $index => $base64File) {
//         $documentType = $validated['document_types'][$index] ?? null;

//         // Extract file extension from base64 string (optional, for file_name)
//         if (preg_match('/^data:.*?\/(.*?);base64,/', $base64File, $match)) {
//             $extension = $match[1];
//             $base64File = preg_replace('/^data:.*?;base64,/', '', $base64File);
//         } else {
//             $extension = 'bin';
//         }

//         $filename = uniqid('doc_') . '.' . $extension;
//         $binaryData = base64_decode($base64File);

//         // Save to DB using Eloquent (insert)
//         $doc = \App\Models\ApplicationDocument::create([
//             'application_id' => $validated['application_id'],
//             'document_type' => $documentType,
//             'file_name' => $filename,
//             'file_path' => $binaryData, // Save as mediumblob
//         ]);

//         $documents[] = $doc->makeHidden(['file_path']);
//     }

//     \DB::table('document_approved_status')->updateOrInsert(
//         ['application_id' => $validated['application_id']],
//         ['status' => 'Pending']
//     );

//     return response()->json([
//         'message' => 'Documents uploaded successfully.',
//         'data' => $documents,
//     ], 201);
// }

public function saveApplicationDocument(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required',
        'document_types' => 'required|array|min:1',
        'document_types.*' => 'required|string|max:191',
        'document_type_ids' => 'required|array|min:1',
        'document_type_ids.*' => 'required|integer',
        'files' => 'required|array|min:1',
        'files.*' => 'required|string', // Expecting base64 string
        'signatures' => 'nullable|array',
        'signatures.*' => 'nullable|string', // base64 string or null
        'photos' => 'nullable|array',
        'photos.*' => 'nullable|string', // base64 string or null
    ]);

    // Only insert new documents, do not delete existing ones
    $documents = [];
    foreach ($validated['files'] as $index => $base64File) {
        $documentType = $validated['document_types'][$index] ?? null;
        $documentTypeId = $validated['document_type_ids'][$index] ?? null;
        $signature = $validated['signatures'][$index] ?? null;
        $photo = $validated['photos'][$index] ?? null;

        // Extract file extension from base64 string (optional, for file_name)
        if (preg_match('/^data:.*?\/(.*?);base64,/', $base64File, $match)) {
            $extension = $match[1];
            $base64File = preg_replace('/^data:.*?;base64,/', '', $base64File);
        } else {
            $extension = 'bin';
        }

        $filename = uniqid('doc_') . '.' . $extension;
        $binaryData = base64_decode($base64File);

        // Save to DB using Eloquent (insert)
        $doc = \App\Models\ApplicationDocument::create([
            'application_id' => $validated['application_id'],
            'document_type' => $documentType,
            'document_type_id' => $documentTypeId,
            'file_name' => $filename,
            'file_path' => $binaryData, // Save as mediumblob
            'signature' => $signature,
            'photo' => $photo,
        ]);

        $documents[] = $doc->makeHidden(['file_path']);
    }

    \DB::table('document_approved_status')->updateOrInsert(
        ['application_id' => $validated['application_id']],
        ['status' => 'Pending']
    );

    return response()->json([
        'message' => 'Documents uploaded successfully.',
        'data' => $documents,
    ], 201);
}

// Delete application document
public function deleteApplicationDocument(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required',
        'id' => 'required',
    ]);

    $deleted = \App\Models\ApplicationDocument::where('application_id', $validated['application_id'])
        ->where('id', $validated['id'])
        ->delete();

    if ($deleted) {
        return response()->json([
            'message' => 'Document deleted successfully.'
            
        ]);
    } else {
        return response()->json([
            'message' => 'Document not found or already deleted.'
        ], 404);
    }
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
 
        'father_prefix_name' => 'nullable|',
        'father_first_name' => 'nullable|string|max:191',
        'father_middle_name' => 'nullable|string|max:191',
        'father_last_name' => 'nullable|string|max:191',
        'father_prefix_name' => 'nullable|',
        'father_first_name' => 'nullable|string|max:191',
        'father_middle_name' => 'nullable|string|max:191',
        'father_last_name' => 'nullable|string|max:191',
        
        'mother_prefix_name' => 'nullable',
        'mother_first_name' => 'nullable|string|max:191',
        'mother_middle_name' => 'nullable|string|max:191',
        'mother_last_name' => 'nullable|string|max:191',
        'birth_place' => 'nullable|string|max:191',
        'birth_country' => 'nullable|string|max:191',
        'nationality' => 'nullable',
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

    // Only insert new nominees, do not delete existing ones
    $savedNominees = [];
    foreach ($validated['nominees'] as $nomineeData) {
        $nomineeData['application_id'] = $validated['application_id'];
        $nominee = \App\Models\AccountNominee::create($nomineeData);
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
// Function to handle Delete account nominee details
// This function deletes a nominee based on application_id and nominee id
public function deleteAccountNominee(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required',
        'id' => 'required',
    ]);

    $deleted = \App\Models\AccountNominee::where('application_id', $validated['application_id'])
        ->where('id', $validated['id'])
        ->delete();

    if ($deleted) {
        return response()->json([
            'message' => 'Nominee deleted successfully.'
        ]);
    } else {
        return response()->json([
            'message' => 'Nominee not found or already deleted.'
        ], 404);
    }
}

// Store service to customer
public function saveServiceToCustomer(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_application_details,id',
        'banking_services_facilities_id' => 'nullable',
        'banking_services_facilities_id.*' => 'nullable',
    ]);

    // 1. Delete all existing records for this application_id
    \App\Models\ServiceToCustomer::where('application_id', $validated['application_id'])->delete();

    // 2. Insert new records
    $saved = [];
    foreach ($validated['banking_services_facilities_id'] as $facilityId) {
        $service = \App\Models\ServiceToCustomer::create([
            'application_id' => $validated['application_id'],
            'banking_services_facilities_id' => $facilityId,
        ]);
        $saved[] = $service;
    }

    DB::table('application_service_status')->updateOrInsert(
        ['application_id' => $validated['application_id']],
        ['status' => 'Pending']
    );  

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
        
      $custlivepic = DB::table('applicant_live_photos')
        ->where('application_id', $applicationId)
        ->get()
        ->map(function ($item) {
            if ($item->path !== null) {
                $item->path = base64_encode($item->path);
            }
            return $item;
        });

    // Fetch application documents and encode 'file_path'
    $custumerdoc = DB::table('application_documents')
        ->where('application_id', $applicationId)
        ->get()
        ->map(function ($item) {
            if ($item->file_path !== null) {
                $item->file_path = base64_encode($item->file_path);
            }
            return $item;
        });

        //Fetch service to customer
        $serviceToCustomer = DB::table('service_to_customers as stc')
    ->join('banking_services_facilities as f', 'stc.banking_services_facilities_id', '=', 'f.id')
    ->join('banking_services as s', 'f.banking_service_id', '=', 's.id')
    ->where('stc.application_id', $applicationId)
    ->select('s.name as service_name', 'f.name as facility_name')
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
            'application_addresss' => $applicationAddresss,
            'customerpic' => $custlivepic,
            'customerdoc' => $custumerdoc,
            'service_to_customer' => $serviceToCustomer,
        ]
    ]);
}

public function getApplicationByAadhaar(Request $request)
{
    $request->validate([
        'auth_code' => 'required|string'
    ]);

    $application = \DB::table('customer_application_details')
        ->where('auth_type', 'Aadhaar Card')
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


// dashboard Approved table 
public function getApplicationsByAgent($agentId)
{
    $applications = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->where('cad.agent_id', $agentId)
        ->select(
            'cad.id',
            'cad.application_no',
            'cad.first_name',
            'cad.last_name',
            'cas.status'
        )
        ->get();

    return response()->json([
        'message' => 'Applications fetched successfully.',
        'data' => $applications
    ]);
}
// all Approved applications agnet
public function getApprovedApplicationsByAgent($agentId)
{
    $applications = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->where('cad.agent_id', $agentId)
        ->where('cas.status', 'approved') // Filter for approved status
        ->select(
            'cad.id',
            'cad.application_no',
            'cad.first_name',
            'cad.last_name',
            'cad.created_at',
            'cad.agent_id',
            'cad.admin_id',
            'cas.status'
        )
        ->get();

    return response()->json([
        'message' => 'Approved applications fetched successfully.',
        'data' => $applications
    ]);
}

// all pending applications agent
public function getPendingApplicationsByAgent($agentId)
{
    $applications = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->where('cad.agent_id', $agentId)
        ->where('cas.status', 'pending') // Filter for pending status
        ->select(
            'cad.id',
            'cad.application_no',
            'cad.first_name',
            'cad.last_name',
            'cad.created_at',
            'cas.status'
        )
        ->get();

    return response()->json([
        'message' => 'Pending applications fetched successfully.',
        'data' => $applications
    ]);
}


// data for the table based on status and agent
// eg --
// agent/applications/by-status/123/review
// agent/applications/by-status/123/rejected
// agent/applications/by-status/123/approved 
public function getApplicationsByAgentAndStatusForTable($agentId, $status)
{
    $applications = DB::table('customer_appliction_status')
        ->leftJoin('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->leftJoin('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->leftJoin('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->leftJoin('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->leftJoin('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->leftJoin('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->leftJoin('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->leftJoin('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->leftJoin('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id')
        ->leftjoin('video_kyc_status', 'customer_appliction_status.application_id', '=', 'video_kyc_status.application_id')
        ->where('customer_application_details.agent_id', $agentId)
        ->where('customer_appliction_status.status', $status)
        ->select(
            'customer_application_details.*',
            'customer_application_details.id as application_id',
            'customer_appliction_status.status as full_application_status',
            'account_personal_details.status as account_personal_details_status',
            'account_personal_details.status_comment as account_personal_details_status_comment',
            'application_address_details.status as application_address_details_status',
            'application_address_details.status_comment as application_address_details_status_comment',
            'agent_live_photos.status as agent_live_photos_status',
            'agent_live_photos.status_comment as agent_live_photos_status_comment',
            'applicant_live_photos.status as applicant_live_photos_status',
            'applicant_live_photos.status_comment as applicant_live_photos_status_comment',
            'application_personal_details.status as application_personal_details_status',
            'application_personal_details.status_comment as application_personal_details_status_comment',
            'application_service_status.status as application_service_status_status',
            'application_service_status.status_comment as application_service_status_status_comment',
            'document_approved_status.status as document_approved_status_status',
            'document_approved_status.status_comment as document_approved_status_status_comment',
            'nominee_approved_status.status as nominee_approved_status_status',
            'nominee_approved_status.status_comment as nominee_approved_status_status_comment',
            'video_kyc_status.status as video_kyc_status',
            'video_kyc_status.comments as video_kyc_status_comment'
        )
        ->get();

    return response()->json([
        'message' => ucfirst($status) . ' applications fetched successfully.',
        'data' => $applications
    ]);
}

public function getReviewApplicationsByAgent($agentId)
{
    $applications = DB::table('customer_appliction_status')
        ->leftJoin('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->leftJoin('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->leftJoin('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->leftJoin('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->leftJoin('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->leftJoin('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->leftJoin('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->leftJoin('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->leftJoin('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id')
        ->where('customer_application_details.agent_id', $agentId)
        ->where('customer_appliction_status.status', 'review')
        ->select(
            'customer_application_details.*',
            'customer_application_details.id as application_id',
            'customer_appliction_status.status as full_application_status',
            'account_personal_details.status as account_personal_details_status',
            'account_personal_details.status_comment as account_personal_details_status_comment',
            'application_address_details.status as application_address_details_status',
            'application_address_details.status_comment as application_address_details_status_comment',
            'agent_live_photos.status as agent_live_photos_status',
            'agent_live_photos.status_comment as agent_live_photos_status_comment',
            'applicant_live_photos.status as applicant_live_photos_status',
            'applicant_live_photos.status_comment as applicant_live_photos_status_comment',
            'application_personal_details.status as application_personal_details_status',
            'application_personal_details.status_comment as application_personal_details_status_comment',
            'application_service_status.status as application_service_status_status',
            'application_service_status.status_comment as application_service_status_status_comment',
            'document_approved_status.status as document_approved_status_status',
            'document_approved_status.status_comment as document_approved_status_status_comment',
            'nominee_approved_status.status as nominee_approved_status_status',
            'nominee_approved_status.status_comment as nominee_approved_status_status_comment'
        )
        ->get();

    return response()->json([
        'message' => 'Review applications fetched successfully.',
        'data' => $applications
    ]);
}

public function getRejectedApplicationsByAgent($agentId)
{
    $applications = DB::table('customer_appliction_status')
        ->leftJoin('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->leftJoin('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->leftJoin('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->leftJoin('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->leftJoin('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->leftJoin('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->leftJoin('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->leftJoin('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->leftJoin('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id')
        ->where('customer_application_details.agent_id', $agentId)
        ->where('customer_appliction_status.status', 'rejected')
        ->select(
            'customer_application_details.*',
            'customer_application_details.id as application_id',
            'customer_appliction_status.status as full_application_status',
            'account_personal_details.status as account_personal_details_status',
            'account_personal_details.status_comment as account_personal_details_status_comment',
            'application_address_details.status as application_address_details_status',
            'application_address_details.status_comment as application_address_details_status_comment',
            'agent_live_photos.status as agent_live_photos_status',
            'agent_live_photos.status_comment as agent_live_photos_status_comment',
            'applicant_live_photos.status as applicant_live_photos_status',
            'applicant_live_photos.status_comment as applicant_live_photos_status_comment',
            'application_personal_details.status as application_personal_details_status',
            'application_personal_details.status_comment as application_personal_details_status_comment',
            'application_service_status.status as application_service_status_status',
            'application_service_status.status_comment as application_service_status_status_comment',
            'document_approved_status.status as document_approved_status_status',
            'document_approved_status.status_comment as document_approved_status_status_comment',
            'nominee_approved_status.status as nominee_approved_status_status',
            'nominee_approved_status.status_comment as nominee_approved_status_status_comment'
        )
        ->get();

    return response()->json([
        'message' => 'Rejected applications fetched successfully.',
        'data' => $applications
    ]);
}
// admin Application Status
public function getKycApplicationTrends(Request $request)
{
    $kycAgentId = $request->input('kyc_agent_id');

    // Safety check
    if (!$kycAgentId) {
        return response()->json(['message' => 'kyc_agent_id is Required.'], 400);
    }

    $currentYear = date('Y');

    // Base query for monthly
    $monthly = DB::table('kyc_application_status as kas')
        ->join('kyc_application as ka', 'kas.kyc_application_id', '=', 'ka.id')
        ->where('ka.kyc_agent_id', $kycAgentId)
        ->whereIn('kas.status', ['approved', 'pending'])
        ->whereYear('kas.created_at', $currentYear)
        ->select(
            DB::raw("DATE_FORMAT(kas.created_at, '%Y-%m') as month"),
            'kas.status',
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('month', 'kas.status')
        ->get();

    // Base query for weekly
    $weekly = DB::table('kyc_application_status as kas')
        ->join('kyc_application as ka', 'kas.kyc_application_id', '=', 'ka.id')
        ->where('ka.kyc_agent_id', $kycAgentId)
        ->whereIn('kas.status', ['approved', 'pending'])
        ->whereYear('kas.created_at', $currentYear)
        ->select(
            DB::raw("DATE_FORMAT(kas.created_at, '%Y-%u') as week"),
            'kas.status',
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('week', 'kas.status')
        ->get();

    return response()->json([
        'message' => 'KYC application trends fetched successfully.',
        'data' => [
            'monthly' => $monthly,
            'weekly' => $weekly
        ]
    ]);
}

// Performance Metrics monthly 
public function getApplicationsByAgentWithDateGroup($agentId)
{
    $applications = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->where('cad.agent_id', $agentId)
        ->select(
            DB::raw("DATE_FORMAT(cas.created_at, '%Y-%m') as month"), // e.g. 2025-06
            DB::raw('YEAR(cas.created_at) as year'),
            DB::raw('MONTH(cas.created_at) as month_number'),
            DB::raw('COUNT(*) as total_applications'),
            DB::raw("SUM(CASE WHEN cas.status = 'approved' THEN 1 ELSE 0 END) as approved"),
            DB::raw("SUM(CASE WHEN cas.status = 'pending' THEN 1 ELSE 0 END) as pending"),
            DB::raw("SUM(CASE WHEN cas.status = 'rejected' THEN 1 ELSE 0 END) as rejected"),
            DB::raw("SUM(CASE WHEN cas.status = 'review' THEN 1 ELSE 0 END) as review")
        )
        ->groupBy('month', 'year', 'month_number')
        ->orderBy('year', 'desc')
        ->orderBy('month_number', 'desc')
        ->get();

    return response()->json([
        'message' => 'Applications grouped by month and year fetched successfully.',
        'data' => $applications
    ]);
}
// Performance Metrics yearly 
public function getApplicationsByAgentYearly($agentId)
{
    $applications = DB::table('customer_appliction_status as cas')
        ->join('customer_application_details as cad', 'cas.application_id', '=', 'cad.id')
        ->where('cad.agent_id', $agentId)
        ->select(
            DB::raw('YEAR(cas.created_at) as year'),
            DB::raw('COUNT(*) as total_applications'),
            DB::raw("SUM(CASE WHEN cas.status = 'approved' THEN 1 ELSE 0 END) as approved"),
            DB::raw("SUM(CASE WHEN cas.status = 'pending' THEN 1 ELSE 0 END) as pending"),
            DB::raw("SUM(CASE WHEN cas.status = 'rejected' THEN 1 ELSE 0 END) as rejected"),
            DB::raw("SUM(CASE WHEN cas.status = 'review' THEN 1 ELSE 0 END) as review")
        )
        ->groupBy('year')
        ->orderBy('year', 'desc')
        ->get();

    return response()->json([
        'message' => 'Yearly applications summary fetched successfully.',
        'data' => $applications
    ]);
}

// Demographics Report
public function getApplicationsByAgeGroups(Request $request)
{
    $agentId = $request->input('agent_id');

    if (!$agentId) {
        return response()->json(['message' => 'agent_id is Required.'], 400);
    }

    $ageGroups = DB::table('customer_application_details')
        ->where('agent_id', $agentId)
        ->selectRaw("
            SUM(CASE 
                WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) BETWEEN 18 AND 25 THEN 1 
                ELSE 0 
            END) as 18_25,
            SUM(CASE 
                WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) BETWEEN 26 AND 35 THEN 1 
                ELSE 0 
            END) as 26_35,
            SUM(CASE 
                WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) BETWEEN 36 AND 50 THEN 1 
                ELSE 0 
            END) as 36_50,
            SUM(CASE 
                WHEN TIMESTAMPDIFF(YEAR, DOB, CURDATE()) > 50 THEN 1 
                ELSE 0 
            END) as 50_plus
        ")
        ->first();

    return response()->json([
        'message' => 'Applications by age group fetched successfully.',
        'data' => $ageGroups
    ]);
}


public function getKycPendingApplicationsByAgent(Request $request)
{
    $agentId = $request->input('agent_id');

    if (!$agentId) {
        return response()->json(['message' => 'agent_id is Required.'], 400);
    }

    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->leftJoin('kyc_data_after_vs_cbs', 'kyc_application.id', '=', 'kyc_data_after_vs_cbs.kyc_application_id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details',
            'kyc_data_after_vs_cbs.kyc_vscbs_first_name',
            'kyc_data_after_vs_cbs.kyc_vscbs_last_name'
        )
        ->where('kyc_application_status.status', 'pending')
        ->where('kyc_application.kyc_agent_id', $agentId)
        ->get();

    return response()->json(['data' => $data], 200);
}

public function videoKycStatus(Request $request)
{
      try {
        $validated = $request->validate([
            'application_id' => 'required',
            'status' => 'required',
            'comments' => 'nullable|string|max:255',
        ]);

        DB::table('video_kyc_status')->updateOrInsert(
            ['application_id' => $validated['application_id']],
            [
                'status' => $validated['status'],
                'comments' => $validated['comments'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Document approved status updated successfully.',
            'data' => [
                'application_id' => $validated['application_id'],
                'status' => $validated['status'],
                'comments' => $validated['comments'] ?? null,
            ],
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error updating document approved status.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function kycVideoKycStatus(Request $request)
{
    try {
        $validated = $request->validate([
            'kyc_application_id' => 'required',
            'status' => 'required',
            'comments' => 'nullable|string|max:255',
        ]);

        DB::table('kyc_video_kyc_status')->updateOrInsert(
            ['kyc_application_id' => $validated['kyc_application_id']],
            [
                'status' => $validated['status'],
                'comments' => $validated['comments'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'KYC video KYC status updated successfully.',
            'data' => [
                'kyc_application_id' => $validated['kyc_application_id'],
                'status' => $validated['status'],
                'comments' => $validated['comments'] ?? null,
            ],
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error updating KYC video KYC status.',
            'error' => $e->getMessage(),
        ], 500);
    }

}

}