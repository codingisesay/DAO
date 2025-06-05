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
use App\Models\CustomerApplicationStatus;

use App\Models\ServiceToCustomer;
use App\Models\AgentLivePhoto;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
   public function getAccountStatus()
{
    $statuses = CustomerApplicationStatus::all();

    return response()->json([
        'data' => $statuses
    ],200);
}

public function getPendingApplications()
{
    $pendingApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no',
            //need to join user table to get the agent name
            
        )
        ->where('customer_appliction_status.status', 'pending')
        ->get();

    return response()->json([
        'data' => $pendingApplications
    ], 200);

}
public function getPendingApplicationsAgentCount(){

    
$agentCounts = DB::table('customer_appliction_status')
    ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
    ->select(
        'customer_application_details.agent_id',
        DB::raw('COUNT(*) as pending_count')
    )
    ->where('customer_appliction_status.status', 'pending')
    ->groupBy('customer_application_details.agent_id')
    ->get();

    return response()->json([
    'data' => $agentCounts
], 200);

}


public function getPendingApplicationsDetailsAgentById($agentId)
{
    $pendingApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no'
        )
        ->where('customer_appliction_status.status', 'pending')
        ->where('customer_application_details.agent_id', $agentId)
        ->get();

    return response()->json([
        'agent_id' => $agentId,
        'pending_applications' => $pendingApplications
    ], 200);
}

public function getDetailsForCustomerDetails($application_id)
{
    $details = DB::table('customer_application_details')
        ->leftJoin('application_personal_details', 'customer_application_details.id', '=', 'application_personal_details.application_id')
        ->leftJoin('applicant_live_photos', 'customer_application_details.id', '=', 'applicant_live_photos.application_id')
        ->select(
            'customer_application_details.*',
            'application_personal_details.*',
            'applicant_live_photos.name as live_photo_name',
            'applicant_live_photos.path as live_photo_path'
        )
        ->where('customer_application_details.id', $application_id)
        ->first();

    return response()->json([
        'details' => $details
    ], 200);
}


public function updateCustomerApplicationDetails($application_id, Request $request)
{
    $admin_id = $request->input('admin_id');
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('customer_application_details')
        ->where('id', $application_id)
        ->update([
            'admin_id' => $admin_id,
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function getApplicationPersonalDetails($application_id)
{
    $details = DB::table('application_personal_details')
        ->join('customer_application_details', 'application_personal_details.application_id', '=', 'customer_application_details.id')
        ->select(
            'application_personal_details.*',
            'customer_application_details.*'
            // Add more fields from customer_application_details if needed
        )
        ->where('application_personal_details.application_id', $application_id)
        ->first();

    return response()->json([
        'details' => $details,
    ], 200);
}

public function getApplicationAddressDetails($application_id)
{
    $details = DB::table('application_address_details')
        ->join('customer_application_details', 'application_address_details.application_id', '=', 'customer_application_details.id')
        ->select(
            'application_address_details.*',
            'customer_application_details.*'
            // Add more fields from customer_application_details if needed
        )
        ->where('application_address_details.application_id', $application_id)
        ->first();

    return response()->json([
        'details' => $details,
    ], 200);
}

public function getApplicantLivePhotosDetails($application_id)
{
    $photos = DB::table('applicant_live_photos')
        ->where('application_id', $application_id)
        ->get();

    return response()->json([
        'photos' => $photos,
    ], 200);
}

public function getApplicationDocuments($application_id)
{
    $documents = DB::table('application_documents')
        ->where('application_id', $application_id)
        ->get();

    return response()->json([
        'documents' => $documents,
    ], 200);

}

public function getAccountPersonalDetails($application_id)
{
    $documents = DB::table('account_personal_details')
        ->where('application_id', $application_id)
        ->get();

    return response()->json([
        'documents' => $documents,
    ], 200);

}

public function getAccountNominees($application_id)
{
    $documents = DB::table('account_nominees')
        ->where('application_id', $application_id)
        ->get();

    return response()->json([
        'documents' => $documents,
    ], 200);

}

function getServiceToCustomer($application_id)
{
    $services = DB::table('service_to_customers')
        ->where('application_id', $application_id)
        ->get();

    return response()->json([
        'services' => $services,
    ], 200);

}
}