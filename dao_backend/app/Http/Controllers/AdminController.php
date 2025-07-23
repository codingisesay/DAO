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
use App\Models\KycApplicationStatus; 

use App\Models\ServiceToCustomer;
use App\Models\AgentLivePhoto;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
   public function getAccountStatus()
{
    $statuses = CustomerApplicationStatus::all();

    return response()->json([
        'data' => $statuses
    ],200);
}

  public function getKYCAccountStatus()
    {
        $statuses = KycApplicationStatus::all();  // Use the correct model here

        return response()->json([
            'data' => $statuses
        ], 200);
    }


public function getPendingApplications()
{
    $pendingApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.id as id',
            'customer_application_details.agent_id as agent_id',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no',
            'customer_application_details.admin_id as admin_id'
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

// Get all approved applications
public function getApprovedApplications()
{
    $approvedApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no',
            'customer_application_details.agent_id as agent_id',
            'customer_application_details.admin_id as admin_id' // Assuming agent_name is a field in customer_application_details
            // You can join user table here if needed for agent name
        )
        ->where('customer_appliction_status.status', 'approved')
        ->get();

    return response()->json([
        'data' => $approvedApplications
    ], 200);
}

// Get approved applications count per agent
public function getApprovedApplicationsAgentCount()
{
    $agentCounts = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_application_details.agent_id',
            DB::raw('COUNT(*) as approved_count')
        )
        ->where('customer_appliction_status.status', 'approved')
        ->groupBy('customer_application_details.agent_id')
        ->get();

    return response()->json([
        'data' => $agentCounts
    ], 200);
}

// Get approved applications for a specific agent
public function getApprovedApplicationsDetailsAgentById($agentId)
{
    $approvedApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no'
        )
        ->where('customer_appliction_status.status', 'approved')
        ->where('customer_application_details.agent_id', $agentId)
        ->get();

    return response()->json([
        'agent_id' => $agentId,
        'approved_applications' => $approvedApplications
    ], 200);
}

// Get all Review applications
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
            'customer_application_details.application_no as application_no',
            'customer_application_details.admin_id as admin_id',
        )
        ->where('customer_appliction_status.status', 'review')
        ->get();

    return response()->json([
        'data' => $reviewApplications
    ], 200);
}

	// Get Review  applications count per agent
public function getReviewApplicationsAgentCount()
{
    $agentCounts = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_application_details.agent_id',
            DB::raw('COUNT(*) as review_count')
        )
        ->where('customer_appliction_status.status', 'review')
        ->groupBy('customer_application_details.agent_id')
        ->get();

    return response()->json([
        'data' => $agentCounts
    ], 200);
}
	// Get all Review applications
public function getReviewApplicationsDetailsAgentById($agentId)
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
        ->where('customer_application_details.agent_id', $agentId)
        ->get();

    return response()->json([
        'agent_id' => $agentId,
        'review_applications' => $reviewApplications
    ], 200);
}

// Get all Rejected applications
// can be use for all the cards table in the admin dashboard
public function getRejectedApplications($status)
{
    $rejectedApplications = DB::table('customer_appliction_status')
        ->leftJoin('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->leftJoin('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->leftJoin('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->leftJoin('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->leftJoin('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->leftJoin('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->leftJoin('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->leftJoin('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->leftJoin('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id')
        ->select(
            'customer_application_details.*', 
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
        ->where('customer_appliction_status.status', $status)
        ->get();

    return response()->json([
        'data' => $rejectedApplications
    ], 200);
}
// get the comments of the applications
public function getResonApplications($status,$application_id)
{
    $rejectedApplications = DB::table('customer_appliction_status')
        ->leftJoin('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->leftJoin('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->leftJoin('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->leftJoin('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->leftJoin('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->leftJoin('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->leftJoin('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->leftJoin('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->leftJoin('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id')
        ->select(
            'customer_application_details.*',
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
        ->where('customer_appliction_status.status', $status)
        ->where('customer_application_details.id', $application_id)
        ->get();

    return response()->json([
        'data' => $rejectedApplications
    ], 200);
}

// comments and status for last buttons  based on the application id 
public function getApplicationDetailsFullComments($application_id)
{
    $applicationDetails = DB::table('customer_appliction_status')
        ->leftJoin('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->leftJoin('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->leftJoin('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->leftJoin('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->leftJoin('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->leftJoin('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->leftJoin('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->leftJoin('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->leftJoin('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id')
        ->select(
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
        ->where('customer_appliction_status.application_id', $application_id)
        ->first();

        if($applicationDetails){

               return response()->json([
        'data' => $applicationDetails
    ], 200);

        }

        //eror



    return response()->json([
        'error' => 'Application details not found for the given application ID.'
    ], 200);
}

	// Get Rejected  applications count per agent
public function getRejectedApplicationsAgentCount()
{
    $agentCounts = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_application_details.agent_id',
            DB::raw('COUNT(*) as reject_count')
        )
        ->where('customer_appliction_status.status', 'Rejected')
        ->groupBy('customer_application_details.agent_id')
        ->get();

    return response()->json([
        'data' => $agentCounts
    ], 200);
}


// Get Rejected applications for a specific agent
public function getRejectedApplicationsDetailsAgentById($agentId,$status)
{
    $rejectedApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->join('account_personal_details', 'customer_appliction_status.application_id', '=', 'account_personal_details.application_id')
        ->join('application_address_details', 'customer_appliction_status.application_id', '=', 'application_address_details.application_id')
        ->join('agent_live_photos', 'customer_appliction_status.application_id', '=', 'agent_live_photos.application_id')
        ->join('applicant_live_photos', 'customer_appliction_status.application_id', '=', 'applicant_live_photos.application_id')
        ->join('application_personal_details', 'customer_appliction_status.application_id', '=', 'application_personal_details.application_id')
        ->join('application_service_status', 'customer_appliction_status.application_id', '=', 'application_service_status.application_id')
        ->join('document_approved_status', 'customer_appliction_status.application_id', '=', 'document_approved_status.application_id')
        ->join('nominee_approved_status', 'customer_appliction_status.application_id', '=', 'nominee_approved_status.application_id'
        )
        
        ->select(
          
            'customer_application_details.*',
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
        )
        ->where('customer_appliction_status.status', $status) // Use 'Rejected' as per your enum
        ->where('customer_application_details.agent_id', $agentId)
        ->get();

    return response()->json([
        'agent_id' => $agentId,
        'rejected_applications' => $rejectedApplications
    ], 200);
}




public function getDetailsForCustomerDetails($application_id)
{ 
$details = DB::table('customer_application_details')
    ->leftJoin('application_personal_details', 'customer_application_details.id', '=', 'application_personal_details.application_id')
    ->leftJoin('applicant_live_photos', 'customer_application_details.id', '=', 'applicant_live_photos.application_id')
    ->select(
         'customer_application_details.id as application_id',
        'customer_application_details.*',
        // 'application_personal_details.*',
        'customer_application_details.gender as gender',
        'applicant_live_photos.name as live_photo_name',
        'applicant_live_photos.path as live_photo_path'
    )
    ->where('customer_application_details.id', $application_id)
    ->first();

if ($details && $details->live_photo_path !== null) {
    $details->live_photo_path = base64_encode($details->live_photo_path);
}

return response()->json([
    'details' => $details
], 200);
}




public function getApplicationPersonalDetails($application_id)
{
    $details = DB::table('application_personal_details')
        ->join('customer_application_details', 'application_personal_details.application_id', '=', 'customer_application_details.id')
        ->select(
            'application_personal_details.*',
            // 'customer_application_details.*'
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

    // Base64 encode the BLOB for each photo
    foreach ($photos as $photo) {
        if ($photo->path !== null) {
            $photo->path = base64_encode($photo->path);
        }
    }

    return response()->json([
        'photos' => $photos,
    ], 200);
}

public function getApplicationDocuments($application_id)
{
    $documents = DB::table('application_documents')
        ->leftJoin('document_approved_status', 'application_documents.application_id', '=', 'document_approved_status.application_id')
        ->where('application_documents.application_id', $application_id)
        ->select(
            'document_approved_status.status as document_status',
            'document_approved_status.status_comment as document_status_comment',
            'application_documents.*'
            
        )
        ->get();

    // Base64 encode the BLOB for each document
    foreach ($documents as $doc) {
        if (isset($doc->file_path) && $doc->file_path !== null) {
            $doc->file_path = base64_encode($doc->file_path);
        }
    }

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
    $nominees = DB::table('account_nominees')
        ->leftJoin('nominee_approved_status', 'account_nominees.application_id', '=', 'nominee_approved_status.application_id')
        ->where('account_nominees.application_id', $application_id)
        ->select(
            'account_nominees.*',
            'nominee_approved_status.status as nominee_status',
            'nominee_approved_status.status_comment as nominee_status_comment'
        )
        ->get();

    return response()->json([
        'nominees' => $nominees,
    ], 200);
}

function getServiceToCustomer($application_id)
{
    $services = DB::table('service_to_customers')
        ->leftJoin('application_service_status', 'service_to_customers.application_id', '=', 'application_service_status.application_id')
        ->where('service_to_customers.application_id', $application_id)
        ->select(
            'service_to_customers.*',
            'application_service_status.status as service_status',
            'application_service_status.status_comment as service_status_comment'
        )
        ->get();

    return response()->json([
        'services' => $services,
    ], 200);
}

function fetchAgentLivePhotos($application_id)
{
    $services = DB::table('agent_live_photos')
        ->where('application_id', $application_id)
        ->get();

    // Base64 encode the BLOB for each service/photo
    foreach ($services as $service) {
        if (isset($service->path) && $service->path !== null) {
            $service->path = base64_encode($service->path);
        }
    }

    return response()->json([
        'services' => $services,
    ], 200);
}


//update status of application 
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

public function updateApplicationPersonalDetails($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('application_personal_details')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateApplicationAddressDetails($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('application_address_details')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateApplicantLivePhotos($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('applicant_live_photos')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateApplicationDocuments($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('document_approved_status')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateAccountPersonalDetails($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('account_personal_details')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateAccountNominees($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('nominee_approved_status')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateServiceToCustomer($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('application_service_status')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}

public function updateAgentLivePhotos($application_id, Request $request)
{
    $status = $request->input('status');
    $status_comment = $request->input('status_comment');

    $updated = DB::table('agent_live_photos')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            'status_comment' => $status_comment,
        ]);


        $updatedFinalStatus = DB::table('customer_appliction_status')
        ->where('application_id', $application_id)
        ->update([
            'status' => $status,
            
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Application details updated successfully.' : 'No changes made.',
    ], 200);
}
// full enrollment Update customer application status by admin 
public function updateCustomerApplicationStatus(Request $request)
{
    $validated = $request->validate([
        'application_id' => 'required|integer|exists:customer_appliction_status.application_id',
        'status' => 'required|string',
        'status_comment' => 'nullable|string'
    ]);

    $updated = DB::table('customer_appliction_status')
        ->where('application_id', $validated['application_id'])
        ->update([
            'status' => $validated['status'],
            'status_comment' => $validated['status_comment'] ?? null,
        ]);

    return response()->json([
        'success' => (bool)$updated,
        'message' => $updated ? 'Status updated successfully.' : 'No changes made.',
    ], 200);
}

// Get all KYC applications with status and comments
public function getKycReasonApplications($status, $kyc_application_id)
{
    $result = DB::table('kyc_application_status')
        ->leftJoin('kyc_document_approved_status', 'kyc_application_status.kyc_application_id', '=', 'kyc_document_approved_status.kyc_application_id')
        ->leftJoin('kyc_data_after_vs_cbs', 'kyc_application_status.kyc_application_id', '=', 'kyc_data_after_vs_cbs.kyc_application_id')
        ->select(
            'kyc_application_status.status as application_status',
            // 'kyc_application_status.status_comment as application_status_comment',
            'kyc_document_approved_status.status as document_status',
            'kyc_document_approved_status.status_comment as document_status_comment',
            'kyc_data_after_vs_cbs.status as after_vs_cbs_status',
            'kyc_data_after_vs_cbs.status_comment as after_vs_cbs_status_comment'
        )
        ->where('kyc_application_status.kyc_application_id', $kyc_application_id)
        ->where(function($query) use ($status) {
            $query->where('kyc_application_status.status', $status)
                  ->orWhere('kyc_document_approved_status.status', $status)
                  ->orWhere('kyc_data_after_vs_cbs.status', $status);
        })
        ->get();

    return response()->json([
        'data' => $result
    ], 200);
}

// Get allRejected  kycReview applications
public function getKycReviewApplications()
{
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
        ->where('kyc_application_status.status', 'review')
        ->get();

    return response()->json(['data' => $data], 200);
}

public function getKycReviewApplicationsAgentCount()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application.kyc_agent_id',
            DB::raw('COUNT(*) as review_count')
        )
        ->where('kyc_application_status.status', 'review')
        ->groupBy('kyc_application.kyc_agent_id')
        ->get();

    return response()->json(['data' => $data], 200);
}

public function getKycReviewApplicationsByAgentId($agentId)
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
        )
        ->where('kyc_application_status.status', 'review')
        ->where('kyc_application.kyc_agent_id', $agentId)
        ->get();

    return response()->json([
        'kyc_agent_id' => $agentId,
        'review_applications' => $data
    ], 200);
}


// Get all Approved applications
public function getKycApprovedApplications()
{
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
        ->where('kyc_application_status.status', 'approved')
        ->get();

    return response()->json(['data' => $data], 200);
}
// Get Approved  kycapplications count per agent
public function getKycApprovedApplicationsAgentCount()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application.kyc_agent_id',
            DB::raw('COUNT(*) as approved_count')
        )
        ->where('kyc_application_status.status', 'approved')
        ->groupBy('kyc_application.kyc_agent_id')
        ->get();

    return response()->json(['data' => $data], 200);
}
// Get Approved   kycapplications for a specific agent
public function getKycApprovedApplicationsByAgentId($agentId)
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
        )
        ->where('kyc_application_status.status', 'approved')
        ->where('kyc_application.kyc_agent_id', $agentId)
        ->get();

    return response()->json([
        'kyc_agent_id' => $agentId,
        'approved_applications' => $data
    ], 200);
}



// Get all Rejected  applications kyc 
public function getKycRejectedApplications($status)
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->join('kyc_data_after_vs_cbs','kyc_application_status.kyc_application_id', '=', 'kyc_data_after_vs_cbs.kyc_application_id')
        ->join('kyc_document_approved_status', 'kyc_application_status.kyc_application_id', '=', 'kyc_document_approved_status.kyc_application_id')
        ->select(
            'kyc_application_status.kyc_application_id as kyc_application_id',
            'kyc_application_status.status as kyc_application_status',
            'kyc_application.*',
            'kyc_data_after_vs_cbs.kyc_vscbs_first_name',
            'kyc_data_after_vs_cbs.kyc_vscbs_middle_name',
            'kyc_data_after_vs_cbs.kyc_vscbs_last_name',
            'kyc_data_after_vs_cbs.status as kyc_data_after_vs_cbs_status',
            'kyc_data_after_vs_cbs.status_comment as kyc_data_after_vs_cbs_status_comment',
            'kyc_document_approved_status.status as kyc_document_approved_status',
            'kyc_document_approved_status.status_comment as kyc_document_approved_status_comment'
        )
        ->where('kyc_application_status.status', $status)
        ->get();

    return response()->json(['data' => $data], 200);
}

// Get Rejected  kycapplications count per agent
public function getKycRejectedApplicationsAgentCount()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application.kyc_agent_id',
            DB::raw('COUNT(*) as rejected_count')
        )
        ->where('kyc_application_status.status', 'rejected')
        ->groupBy('kyc_application.kyc_agent_id')
        ->get();

    return response()->json(['data' => $data], 200);
}
// Get Rejected  kycapplications for a specific agent
public function getKycRejectedApplicationsByAgentId($agentId,$status)
{

    
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->join('kyc_data_after_vs_cbs','kyc_application_status.kyc_application_id', '=', 'kyc_data_after_vs_cbs.kyc_application_id')
        ->join('kyc_document_approved_status', 'kyc_application_status.kyc_application_id', '=', 'kyc_document_approved_status.kyc_application_id')
        ->select(
            'kyc_application_status.kyc_application_id as kyc_application_id',
            'kyc_application_status.status as kyc_application_status',
            'kyc_application.*',
            'kyc_data_after_vs_cbs.kyc_vscbs_first_name',
            'kyc_data_after_vs_cbs.kyc_vscbs_middle_name',
            'kyc_data_after_vs_cbs.kyc_vscbs_last_name',
            'kyc_data_after_vs_cbs.status as kyc_data_after_vs_cbs_status',
            'kyc_data_after_vs_cbs.status_comment as kyc_data_after_vs_cbs_status_comment',
            'kyc_document_approved_status.status as kyc_document_approved_status',
            'kyc_document_approved_status.status_comment as kyc_document_approved_status_comment'
        )
        ->where('kyc_application_status.status', $status)
        ->where('kyc_application.kyc_agent_id', $agentId)
        ->get();

    return response()->json([
        'kyc_agent_id' => $agentId,
        'rejected_applications' => $data
    ], 200);
}
// Get all Pending   applications
public function getKycPendingApplications()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->leftJoin('kyc_data_after_vs_cbs', 'kyc_application.id', '=', 'kyc_data_after_vs_cbs.kyc_application_id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.*',
            'kyc_data_after_vs_cbs.kyc_vscbs_first_name',
            'kyc_data_after_vs_cbs.kyc_vscbs_last_name'
        )
        ->where('kyc_application_status.status', 'pending')
        ->get();

    return response()->json(['data' => $data], 200);
}

	// Get Pending  kycapplications count per agent

public function getKycPendingApplicationsAgentCount()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application.kyc_agent_id',
            DB::raw('COUNT(*) as pending_count')
        )
        ->where('kyc_application_status.status', 'pending')
        ->groupBy('kyc_application.kyc_agent_id')
        ->get();

    return response()->json(['data' => $data], 200);
}

// Get Pending   kycapplications for a specific agent
public function getKycPendingApplicationsByAgentId($agentId)
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
        )
        ->where('kyc_application_status.status', 'pending')
        ->where('kyc_application.kyc_agent_id', $agentId)
        ->get();

    return response()->json([
        'kyc_agent_id' => $agentId,
        'pending_applications' => $data
    ], 200);
}


public function getAllKycDetails($id)
{
    // Fetch the base application
    $application = DB::table('kyc_application')->where('id', $id)->first();

    if (!$application) {
        return response()->json([
            'message' => 'No KYC data found for this application ID.',
            'data' => null
        ], 404);
    }

    // Fetch related records (One-to-Many tables)
    $status = DB::table('kyc_application_status')->where('kyc_application_id', $id)->get();
    $documents = DB::table('kyc_customer_document')->where('kyc_application_id', $id)->get();
    $vsCbsData = DB::table('kyc_data_after_vs_cbs')->where('kyc_application_id', $id)->get();
    $verifyCbs = DB::table('kyc_data_from_verify_cbs')->where('kyc_application_id', $id)->get();
    $verifySources = DB::table('kyc_data_from_verify_sources')->where('kyc_application_id', $id)->get();
    $approvedStatus = DB::table('kyc_document_approved_status')->where('kyc_application_id', $id)->get();

    // Encode any binary file paths in documents
    $documents->transform(function ($doc) {
        if (isset($doc->kyc_file_path)) {
            $doc->kyc_file_path = base64_encode($doc->kyc_file_path);
        }
        return $doc;
    });

    return response()->json([
        'message' => 'KYC details fetched successfully.',
        'data' => [
            'application' => $application,
            'status' => $status,
            'documents' => $documents,
            'vs_cbs_data' => $vsCbsData,
            'verify_cbs' => $verifyCbs,
            'verify_sources' => $verifySources,
            'approved_status' => $approvedStatus,
        ]
    ]);
}





public function getMonthlyApprovedApplications()
{
    $currentYear = Carbon::now()->year;

    $monthlyData = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->where('customer_appliction_status.status', 'approved')
        ->whereYear('customer_appliction_status.created_at', $currentYear)
        ->selectRaw('MONTH(customer_appliction_status.created_at) as month, COUNT(*) as count')
        ->groupBy(DB::raw('MONTH(customer_appliction_status.created_at)'))
        ->orderBy('month')
        ->get();

    // Initialize all months with 0
    $allMonths = collect(range(1, 12))->mapWithKeys(function ($month) {
        return [$month => 0];
    });

    // Merge real data
    foreach ($monthlyData as $item) {
        $allMonths[$item->month] = $item->count;
    }

    // Prepare output for chart
    $labels = [];
    $data = [];

    foreach ($allMonths as $month => $count) {
        $labels[] = Carbon::create()->month($month)->format('F'); // Jan, Feb, etc.
        $data[] = $count;
    }

    return response()->json([
        'labels' => $labels,
        'data' => $data
    ]);
}

public function getMonthlyAuthTypeCounts()
{
    $currentYear = now()->year;

    $rawData = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->where('customer_appliction_status.status', 'approved')
        ->whereYear('customer_appliction_status.created_at', $currentYear)
        ->selectRaw('MONTH(customer_appliction_status.created_at) as month, customer_application_details.auth_type, COUNT(*) as count')
        ->groupBy('month', 'customer_application_details.auth_type')
        ->orderBy('month')
        ->get();

    $authTypes = ['Pan Card', 'Aadhar Card', 'DIGILOCKER'];
    $months = range(1, 12);

    $data = [];
    foreach ($authTypes as $auth) {
        foreach ($months as $month) {
            $data[$auth][$month] = 0;
        }
    }

    foreach ($rawData as $row) {
        $data[$row->auth_type][$row->month] = $row->count;
    }

    $response = [
        'labels' => array_map(fn($m) => \Carbon\Carbon::create()->month($m)->format('F'), $months),
        'data' => []
    ];

    foreach ($authTypes as $auth) {
        $response['data'][] = [
            'label' => $auth,
            'data' => array_values($data[$auth])
        ];
    }

    return response()->json($response);
}


public function getWeeklyAuthTypeCounts()
{
    $currentYear = now()->year;

    $rawData = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->where('customer_appliction_status.status', 'approved')
        ->whereYear('customer_appliction_status.created_at', $currentYear)
        ->selectRaw('WEEK(customer_appliction_status.created_at, 1) as week, customer_application_details.auth_type, COUNT(*) as count')
        ->groupBy('week', 'customer_application_details.auth_type')
        ->orderBy('week')
        ->get();

    $authTypes = ['Pan Card', 'Aadhar Card', 'DIGILOCKER'];
    $weeks = range(1, 53); // ISO weeks

    $data = [];
    foreach ($authTypes as $auth) {
        foreach ($weeks as $week) {
            $data[$auth][$week] = 0;
        }
    }

    foreach ($rawData as $row) {
        $data[$row->auth_type][$row->week] = $row->count;
    }

    $response = [
        'labels' => array_map(fn($w) => "Week $w", $weeks),
        'data' => []
    ];

    foreach ($authTypes as $auth) {
        $response['data'][] = [
            'label' => $auth,
            'data' => array_values($data[$auth])
        ];
    }

    return response()->json($response);
}

public function getKycStatusCountsForCurrentYear()
{
    $currentYear = now()->year;

    $statusCounts = DB::table('kyc_application_status')
        ->whereYear('created_at', $currentYear)
        ->select('status', DB::raw('COUNT(*) as count'))
        ->whereIn('status', ['Pending', 'Approved', 'Reject']) // UPPERCASE
        ->groupBy('status')
        ->pluck('count', 'status');

    // Fill missing with 0
    $data = [
        'Approved' => $statusCounts['Approved'] ?? 0,
        'Reject'   => $statusCounts['Reject'] ?? 0,
        'Pending'  => $statusCounts['Pending'] ?? 0,
    ];

    return response()->json($data);
}


}