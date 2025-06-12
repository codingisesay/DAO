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
            'customer_application_details.application_no as application_no'
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
            'customer_application_details.application_no as application_no'
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
public function getRejectedApplications()
{
    $rejectedApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no'
        )
        ->where('customer_appliction_status.status', 'rejected')
        ->get();

    return response()->json([
        'data' => $rejectedApplications
    ], 200);
}
	// Get Rejected  applications count per agent
public function getRejectedApplicationsAgentCount()
{
    $agentCounts = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_application_details.agent_id',
            DB::raw('COUNT(*) as rejected_count')
        )
        ->where('customer_appliction_status.status', 'rejected')
        ->groupBy('customer_application_details.agent_id')
        ->get();

    return response()->json([
        'data' => $agentCounts
    ], 200);
}
// Get Rejected applications for a specific agent
public function getRejectedApplicationsDetailsAgentById($agentId)
{
    $rejectedApplications = DB::table('customer_appliction_status')
        ->join('customer_application_details', 'customer_appliction_status.application_id', '=', 'customer_application_details.id')
        ->select(
            'customer_appliction_status.*',
            'customer_application_details.first_name as first_name',
            'customer_application_details.middle_name as middle_name',
            'customer_application_details.last_name as last_name',
            'customer_application_details.created_at as created_at',
            'customer_application_details.application_no as application_no'
        )
        ->where('customer_appliction_status.status', 'rejected')
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

function fetchAgentLivePhotos($application_id)
{
    $services = DB::table('agent_live_photos')
        ->where('application_id', $application_id)
        ->get();

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

// Get allRejected  kycReview applications
public function getKycReviewApplications()
{
    $data = DB::table('kyc_application_status')
       ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')

        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details',
           
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
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
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



// Get all Rejected  applications
public function getKycRejectedApplications()
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
        )
        ->where('kyc_application_status.status', 'rejected')
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
public function getKycRejectedApplicationsByAgentId($agentId)
{
    $data = DB::table('kyc_application_status')
        ->join('kyc_application', 'kyc_application_status.kyc_application_id', '=', 'kyc_application.id')
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
        )
        ->where('kyc_application_status.status', 'rejected')
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
        ->select(
            'kyc_application_status.*',
            'kyc_application.kyc_application_no',
            'kyc_application.verify_from',
            'kyc_application.verify_details'
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
    $kycData = DB::table('kyc_application as ka')
        ->leftJoin('kyc_application_status as kas', 'ka.id', '=', 'kas.kyc_application_id')
        ->leftJoin('kyc_customer_document as kcd', 'ka.id', '=', 'kcd.kyc_application_id')
        ->leftJoin('kyc_data_after_vs_cbs as kda', 'ka.id', '=', 'kda.kyc_application_id')
        ->leftJoin('kyc_data_from_verify_cbs as kdvcbs', 'ka.id', '=', 'kdvcbs.kyc_application_id')
        ->leftJoin('kyc_data_from_verify_sources as kdvs', 'ka.id', '=', 'kdvs.kyc_application_id')
        ->leftJoin('kyc_document_approved_status as kdas', 'ka.id', '=', 'kdas.kyc_application_id')
        ->where('ka.id', $id)
        ->select(
            'ka.*',
            'kas.*',
            'kcd.*',
            'kda.*',
            'kdvcbs.*',
            'kdvs.*',
            'kdas.*'
        )
        ->get(); // Use ->first() if expecting only one record

    if ($kycData->isEmpty()) {
        return response()->json([
            'message' => 'No KYC data found for this application ID.',
            'data' => null
        ], 404);
    }

    return response()->json([
        'message' => 'KYC details fetched successfully',
        'data' => $kycData
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