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
    $validated = $request->validate([
        'kyc_application_id' => 'required|integer',
        'from_verify_sources' => 'nullable|array',
        'from_verify_cbs' => 'nullable|array',
        'after_vs_cbs' => 'nullable|array',
    ]);

    // Prepare data for each table
    $afterVsCbsData = [
        'kyc_application_id' => $validated['kyc_application_id'],
    ];
    
    $fromVerifyCbsData = [
        'kyc_application_id' => $validated['kyc_application_id'],
    ];
    
    $fromVerifySourcesData = [
        'kyc_application_id' => $validated['kyc_application_id'],
    ];

    // Merge the nested data if it exists
    if (!empty($validated['after_vs_cbs'])) {
        $afterVsCbsData = array_merge($afterVsCbsData, $validated['after_vs_cbs']);
    }
    
    if (!empty($validated['from_verify_cbs'])) {
        $fromVerifyCbsData = array_merge($fromVerifyCbsData, $validated['from_verify_cbs']);
    }
    
    if (!empty($validated['from_verify_sources'])) {
        $fromVerifySourcesData = array_merge($fromVerifySourcesData, $validated['from_verify_sources']);
    }

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
        'data' => [
            'after_vs_cbs' => $afterVsCbsData,
            'from_verify_cbs' => $fromVerifyCbsData,
            'from_verify_sources' => $fromVerifySourcesData,
        ]
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
//         'auth_type' => 'nullable|in:Pan Card,Aadhaar Card,Digilocker',
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
    $validated = $request->validate([
        'kyc_application_id' => 'required',
        'kyc_application_no' => 'nullable|string|max:191',
        'document_types' => 'required|array|min:1',
        'document_types.*' => 'required|string|max:191',
        'document_type_ids' => 'required|array|min:1',
        'document_type_ids.*' => 'required|integer',
        'files' => 'required|array',
        'files.*' => 'nullable|string',
        'signatures' => 'nullable|array',
        'signatures.*' => 'nullable|string',
        'photos' => 'nullable|array',
        'photos.*' => 'nullable|string',
    ]);

    $documents = [];
    foreach ($validated['files'] as $index => $file) {
    $documentType = $validated['document_types'][$index] ?? null;
    $documentTypeId = $validated['document_type_ids'][$index] ?? null;
    $signature = $validated['signatures'][$index] ?? null;
    $photo = $validated['photos'][$index] ?? null;
    $kycApplicationNo = $validated['kyc_application_no'] ?? null;

    // Handle base64 file
    if (preg_match('/^data:.*?\/(.*?);base64,/', $file, $match)) {
        $extension = $match[1];
        $file = preg_replace('/^data:.*?;base64,/', '', $file);
    } else {
        $extension = 'bin';
    }

    $filename = uniqid('doc_') . '.' . $extension;
    $binaryContent = base64_decode($file);

    $doc = kycApplicationDocument::create([
        'kyc_application_id' => $validated['kyc_application_id'],
        'kyc_application_no' => $kycApplicationNo,
        'kyc_document_type' => $documentType,
        'kyc_document_type_id' => $documentTypeId,
        'kyc_signature' => $signature,
        'kyc_photo' => $photo,
        'kyc_file_name' => $filename,
        'kyc_file_path' => $binaryContent,
    ]);

    $documents[] = $doc->makeHidden(['kyc_file_path']);
}

    // Delete + Insert in kyc_document_approved_status
    DB::table('kyc_document_approved_status')
        ->where('kyc_application_id', $validated['kyc_application_id'])
        ->delete();

    DB::table('kyc_document_approved_status')->insert([
        'kyc_application_id' => $validated['kyc_application_id'],
        'status' => 'Pending',
    ]);

    // Delete + Insert in kyc_application_status
    DB::table('kyc_application_status')
        ->where('kyc_application_id', $validated['kyc_application_id'])
        ->delete();

    DB::table('kyc_application_status')->insert([
        'kyc_application_id' => $validated['kyc_application_id'],
        'status' => 'Pending',
    ]);

    return response()->json([
        'message' => 'Documents uploaded successfully.',
        'data' => $documents,
    ], 201);
}

// Delete KYC application document Function
// This function deletes a KYC application document based on the provided kyc_application_id and id
public function deleteKycCustomerDocument(Request $request)
{
    $validated = $request->validate([
       'kyc_application_id' => 'required|integer',
       'id' => 'required|integer',
    ]);

    $deleted = DB::table('kyc_customer_document')
        ->where('kyc_application_id', $validated['kyc_application_id'])
        ->where('id', $validated['id'])
        ->delete();

    if ($deleted) {
        return response()->json([
            'message' => 'KYC customer document deleted successfully.'
        ]);
    } else {
        return response()->json([
            'message' => 'Document not found or already deleted.'
        ], 404);
    }
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

public function updateKycApplicationStatus(Request $request)
{
    $validated = $request->validate([
        'kyc_application_id' => 'required|integer',
        'status' => 'required',
        // 'status_comment' => 'nullable|string|max:500',
    ]);

    DB::table('kyc_application_status')->updateOrInsert(
        ['kyc_application_id' => $validated['kyc_application_id']],
        [
            'status' => $validated['status'],
            // 'status_comment' => $validated['status_comment'] ?? null,
        ]
    );

    return response()->json([
        'message' => 'KYC Application status updated successfully.',
    ], 200);
}


}
