<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\kycApplication;

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

        $doc = ApplicationDocument::updateOrCreate(
            [
                'kyc_application_id' => $validated['kyc_application_id'],
                'document_type' => $documentType,
            ],
            [
                'kyc_application_id' => $validated['kyc_application_id'],
                'document_type' => $documentType,
                'file_name' => $filename,
                'file_path' => $path,
            ]
        );

        $documents[] = $doc;
    }

    DB::table('kyc_customer_document')->insert([
        'kyc_application_id' => $validated['kyc_application_id'],
        'status' => 'Pending',
        
       
    ]);

    return response()->json([
        'message' => 'Documents uploaded successfully.',
        'data' => $documents,
    ], 201);
}


}
