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
}