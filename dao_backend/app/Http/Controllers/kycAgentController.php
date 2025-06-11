<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\kycApplication;
use App\Models\kycApplicationDocument;
use Illuminate\Support\Facades\DB;

class kycAgentController extends Controller
{


 public function startKyc(Request $request){
    // Validate the incoming request data
    $validatedData = $request->validate([
        'verify_from' => 'required',
        'verify_details' => 'required',
       
    ]);
     $validatedData['kyc_agent_id'] = 1;

     // Try to find an existing application by auth_type + auth_code
    $existingApplication = kycApplication::where('verify_from', $validatedData['verify_from'] ?? null)
        ->where('verify_details', $validatedData['verify_details'] ?? null)
        ->first();

    if ($existingApplication) {
        // Update the existing application
        $existingApplication->update($validatedData);
        $applicationNo = $existingApplication->kyc_application_no;
        $applicationId = $existingApplication->id;
        $customerApplication = $existingApplication;
        $message = 'Customer application details updated successfully.';
    } else {
        // Generate a unique application number
        $applicationNo = 'KYCAPP' . strtoupper(uniqid());
        $validatedData['kyc_application_no'] = $applicationNo;

        // Insert data into the database
        $customerApplication = kycApplication::create($validatedData);
        $applicationId = $customerApplication->id;
        $message = 'Customer application details saved successfully.';
    }

    return response()->json([
        'message' => $message,
        'kyc_application_no' => $applicationNo,
        'kyc_application_id' => $applicationId,
        'data' => $customerApplication,
    ], 201);

}


public function saveAllKycData(Request $request)
{
    // Hardcode kyc_application_id for testing
    // $request->merge(['kyc_application_id' => 1]);

    $validated = $request->validate([
        'kyc_application_id' => 'required|integer',
        // Add other fields as per your table structure for each table
        // 'after_vs_cbs_field1' => 'nullable|string',
        // 'from_verify_cbs_field1' => 'nullable|string',
        // 'from_verify_sources_field1' => 'nullable|string',
    ]);

    // Prepare data for each table (replace with your actual fields)
    $afterVsCbsData = [
        'kyc_application_id' => $validated['kyc_application_id'],
        
    ];

    $fromVerifyCbsData = [
        'kyc_application_id' => $validated['kyc_application_id'],
       
    ];

    $fromVerifySourcesData = [
        'kyc_application_id' => $validated['kyc_application_id'],
       
    ];

    // Insert or update in all three tables
    DB::table('kyc_data_after_vs_cbs')->updateOrInsert(
        ['kyc_application_id' => $validated['kyc_application_id']],
        $afterVsCbsData
    );

    DB::table('kyc_data_from_verify_cbs')->updateOrInsert(
        ['kyc_application_id' => $validated['kyc_application_id']],
        $fromVerifyCbsData
    );

    DB::table('kyc_data_from_verify_sources')->updateOrInsert(
        ['kyc_application_id' => $validated['kyc_application_id']],
        $fromVerifySourcesData
    );

    return response()->json([
        'message' => 'All KYC data saved successfully.',
    ], 201);
}









//     public function EnrollmentDetails(Request $request)
// {
//     // Normalize gender input to match validation
//     $request->merge([
//         'gender' => ucfirst(strtolower($request->input('gender')))
//     ]);

//     // Validate incoming request data (excluding application_no since it will be generated)
//     $validatedData = $request->validate([
//         'auth_type' => 'nullable|in:Pan Card,Aadhar Card,Digilocker',
//         'auth_code' => 'nullable|string',
//         'auth_status' => 'nullable|string',
//         'first_name' => 'nullable|string',
//         'middle_name' => 'nullable|string',
//         'last_name' => 'nullable|string',
//         'DOB' => 'nullable|date',
//         'gender' => 'nullable|in:Male,Female,Others',
//         'mobile' => 'nullable|string',
//         'complex_name' => 'nullable|string',
//         'flat_no' => 'nullable|string',
//         'area' => 'nullable|string',
//         'landmark' => 'nullable',
//         'country' => 'nullable|string',
//         'pincode' => 'nullable|string', 
//         'city' => 'nullable|string',
//         'district' => 'nullable|string',
//         'state' => 'nullable|string',
//         'status' => 'nullable',
//     ]);

//     // Add the agent ID to the validated data from the authenticated user
//     $validatedData['agent_id'] = 1;

//     // Try to find an existing application by auth_type + auth_code
//     $existingApplication = CustomerApplicationDetail::where('auth_type', $validatedData['auth_type'] ?? null)
//         ->where('auth_code', $validatedData['auth_code'] ?? null)
//         ->first();

//     if ($existingApplication) {
//         // Update the existing application
//         $existingApplication->update($validatedData);
//         $applicationNo = $existingApplication->application_no;
//         $applicationId = $existingApplication->id;
//         $customerApplication = $existingApplication;
//         $message = 'Customer application details updated successfully.';
//     } else {
//         // Generate a unique application number
//         $applicationNo = 'APP' . strtoupper(uniqid());
//         $validatedData['application_no'] = $applicationNo;

//         // Insert data into the database
//         $customerApplication = CustomerApplicationDetail::create($validatedData);
//         $applicationId = $customerApplication->id;
//         $message = 'Customer application details saved successfully.';
//     }

//     return response()->json([
//         'message' => $message,
//         'application_no' => $applicationNo,
//         'application_id' => $applicationId,
//         'data' => $customerApplication,
//     ], 201);
// }

public function kycSaveApplicationDocument(Request $request)
{
    // Hardcode application_id for testing if needed
    // $request->merge(['application_id' => 1]);

    $validated = $request->validate([
        'kyc_application_id' => 'required',
        'document_types' => 'required|array|min:1',
        'document_types.*' => 'required|string|max:191',
        'files' => 'required|array|min:1',
        'files.*' => 'file|max:10240',
    ]);

    $documents = [];
    foreach ($validated['files'] as $index => $file) {
        $documentType = $validated['document_types'][$index] ?? null;
        $filename = uniqid('doc_') . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('kyc_application_documents', $filename, 'public');

        $doc = kycApplicationDocument::updateOrCreate(
            [
                'kyc_application_id' => $validated['kyc_application_id'],
                'kyc_document_type' => $documentType,
            ],
            [
                'kyc_application_id' => $validated['kyc_application_id'],
                'kyc_document_type' => $documentType,
                'kyc_file_name' => $filename,
                'kyc_file_path' => $path,
                 'updated_at' => now(),
                 'created_at' => now(),
            ]
        );

        $documents[] = $doc;
    }

    DB::table('kyc_document_approved_status')->updateOrInsert([
        'kyc_application_id' => $validated['kyc_application_id'],
        'status' => 'Pending',
    ]);

     // Insert into the kyc_application_status table
    DB::table('kyc_application_status')->updateOrInsert([
        'kyc_application_id' => $validated['kyc_application_id'],
        'status' => 'Pending', // You can set the status as per your requirement
    ]);

    return response()->json([
        'message' => 'Documents uploaded successfully.',
        'data' => $documents,
    ], 201);
}

public function updateKycDocumentStatus(Request $request)
{
    $validated = $request->validate([
        'kyc_application_id' => 'required|integer',
        'status' => 'required|string|max:191',
        'status_comment' => 'nullable|string|max:500',
    ]);

    DB::table('kyc_document_approved_status')->updateOrInsert(
        ['kyc_application_id' => $validated['kyc_application_id']],
        [
            'status' => $validated['status'],
            'status_comment' => $validated['status_comment'] ?? null,
            
        ]
    );

    return response()->json([
        'message' => 'KYC document status updated successfully.',
    ], 200);
}

public function updateKycAfterVsCbsStatus(Request $request)
{
    $validated = $request->validate([
        'kyc_application_id' => 'required|integer',
        'status' => 'required|string|max:191',
        'status_comment' => 'nullable|string|max:500',
    ]);

    DB::table('kyc_data_after_vs_cbs')->updateOrInsert(
        ['kyc_application_id' => $validated['kyc_application_id']],
        [
            'status' => $validated['status'],
            'status_comment' => $validated['status_comment'] ?? null,
        ]
    );

    return response()->json([
        'message' => 'KYC After VS CBS status updated successfully.',
    ], 200);
}


public function getKycDocumentReviewApplications()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_pplication_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application_status.*',
            'customer_application_details.first_name',
            'customer_application_details.middle_name',
            'customer_application_details.last_name',
            'customer_application_details.application_no',
            'customer_application_details.created_at'
        )
        ->where('kyc_application_status.status', 'review')
        ->get();

    return response()->json(['data' => $data], 200);
}

public function getReviewApplications()
{
    $reviewApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no'
        )
        ->where('customer_appliction_status.status', 'review')
        ->get();

    return response()->json([
        'data' => $reviewApplications
    ], 200);
}

}
