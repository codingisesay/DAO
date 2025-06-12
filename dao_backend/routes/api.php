<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Services\EurekaService;
use App\Http\Controllers\Api\AuthProxyController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\kycAgentController;
use App\Http\Controllers\VideoKycController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });



Route::get('/eureka/register', function (EurekaService $eureka) {
    return $eureka->register()->body();
});

Route::get('/eureka/heartbeat', function (EurekaService $eureka) {
    return $eureka->sendHeartbeat()->status();
});

Route::get('/eureka/deregister', function (EurekaService $eureka) {
    return $eureka->deregister()->status();
});

//Video Kyc

Route::post('/video-kyc/create/{application_id}', [VideoKycController::class, 'create']);
Route::post('/video-kyc/upload', [VideoKycController::class, 'upload']);

// Route::middleware(['jwt.auth'])->group(function () {

    // Route::middleware('role:admin')->group(function () {
   
    Route::get('/admin/accountSatus', [AdminController::class, 'getAccountStatus']);
    Route::get('/admin/kycaccountsStatus', [AdminController::class, 'getKYCAccountStatus']);
    //pending 
    Route::get('/admin/pendingApplication', [AdminController::class, 'getPendingApplications']);
    Route::get('/admin/pendingApplicationCount', [AdminController::class, 'getPendingApplicationsAgentCount']);
    Route::get('/admin/pendingApplicationDetails/{agentId}', [AdminController::class, 'getPendingApplicationsDetailsAgentById']);
    Route::get('/admin/pendingApplicationDetailsByID/{application_id}', [AdminController::class, 'getDetailsForCustomerDetails']);
    //approved
    Route::get('/admin/approvedApplication', [AdminController::class, 'getApprovedApplications']);
    Route::get('/admin/approvedApplicationCount', [AdminController::class, 'getApprovedApplicationsAgentCount']);
    Route::get('/admin/approvedApplicationDetails/{agentId}', [AdminController::class, 'getApprovedApplicationsDetailsAgentById']);
    //review
    Route::get('/admin/reviewApplication', [AdminController::class, 'getReviewApplications']);
    Route::get('/admin/reviewApplicationCount', [AdminController::class, 'getReviewApplicationsAgentCount']);
    Route::get('/admin/reviewApplicationDetails/{agentId}', [AdminController::class, 'getReviewApplicationsDetailsAgentById']);
    //rejected
    Route::get('admin/applications/rejected', [AdminController::class, 'getRejectedApplications']);
    Route::get('admin/applications/rejected/count-by-agent', [AdminController::class, 'getRejectedApplicationsAgentCount']);
    Route::get('admin/applications/rejected/agent/{agentId}', [AdminController::class, 'getRejectedApplicationsDetailsAgentById']);
    //kyc review 
    Route::get('/admin/kycReviewApplication', [AdminController::class, 'getKycReviewApplications']);
    // kyc approved table 
    Route::get('/admin/kyc-applications/approved', [AdminController::class, 'getKycApprovedApplications']);
    // kyc rejected table 
    Route::get('/admin/kyc-applications/rejected', [AdminController::class, 'getKycRejectedApplications']);
    // kyc pending table
    Route::get('/admin/kyc-applications/pending', [AdminController::class, 'getKycPendingApplications']);
    // kyc all application fetch route 
    Route::get('admin/kyc/details/{id}', [AdminController::class, 'getAllKycDetails']);
    // monthly account count 
    Route::get('admin/kyc-applications/approved/monthly', [AdminController::class, 'getMonthlyApprovedApplications']);
    // Validation pan aadhar digi  monthly  count
    Route::get('admin/applications/approved/monthly-auth', [AdminController::class, 'getMonthlyAuthTypeCounts']);
    // Validation pan aadhar digi  weekly  count
    Route::get('admin/applications/approved/weekly-auth', [AdminController::class, 'getWeeklyAuthTypeCounts']);
    // KYC Verification Status count yearly of approved , rejected , pending 
    Route::get('admin/kyc-applications/status-summary', [AdminController::class, 'getKycStatusCountsForCurrentYear']);




     
     

    // Route::post('/admin/updateCustomerApplicationDetails/{application_id}', [AdminController::class, 'updateCustomerApplicationDetails']);
   
      Route::get('/admin/fetchApplicationPersonalDetails/{application_id}', [AdminController::class, 'getApplicationPersonalDetails']);
      Route::get('/admin/fetchApplicationAddressDetails/{application_id}', [AdminController::class, 'getApplicationAddressDetails']);
      Route::get('/admin/fetchApplicantLivePhotosDetails/{application_id}', [AdminController::class, 'getApplicantLivePhotosDetails']);
      Route::get('/admin/fetchApplicationDocuments/{application_id}', [AdminController::class, 'getApplicationDocuments']);
      Route::get('/admin/fetchAccountPersonalDetails/{application_id}', [AdminController::class, 'getAccountPersonalDetails']);
       Route::get('/admin/fetchAccountNominees/{application_id}', [AdminController::class, 'getAccountNominees']);
       Route::get('/admin/fetchServiceToCustomer/{application_id}', [AdminController::class, 'getServiceToCustomer']);

       Route::get('/admin/fetchAgentLivePhotos/{application_id}', [AdminController::class, 'fetchAgentLivePhotos']);

//update customer application details
          Route::post('/admin/updateCustomerApplicationDetails/{application_id}', [AdminController::class, 'updateCustomerApplicationDetails']);
          Route::post('/admin/updateApplicationPersonalDetails/{application_id}', [AdminController::class, 'updateApplicationPersonalDetails']);
          Route::post('/admin/updateApplicationAddressDetails/{application_id}', [AdminController::class, 'updateApplicationAddressDetails']);
          Route::post('/admin/updateApplicantLivePhotos/{application_id}', [AdminController::class, 'updateApplicantLivePhotos']);
          Route::post('/admin/updateApplicationDocuments/{application_id}', [AdminController::class, 'updateApplicationDocuments']);
          Route::post('/admin/updateAccountPersonalDetails/{application_id}', [AdminController::class, 'updateAccountPersonalDetails']);
          Route::post('/admin/updateAccountNominees/{application_id}', [AdminController::class, 'updateAccountNominees']);
          Route::post('/admin/updateServiceToCustomer/{application_id}', [AdminController::class, 'updateServiceToCustomer']);

          Route::post('/admin/updateAgentLivePhotos/{application_id}', [AdminController::class, 'updateAgentLivePhotos']);
   

    // });





    // Route::middleware('role:agent')->group(function () {
        Route::post('/agent/accounts', [AgentController::class, 'handleAccounts']);
        Route::post('/agent/enrollment', [AgentController::class, 'EnrollmentDetails'])->name('enrollment.details');
        Route::post('/agent/personal-details', [AgentController::class, 'savePersonalDetails']);
        Route::post('/agent/address-details', [AgentController::class, 'saveAddressDetails']);
        Route::post('/agent/live-photo', [AgentController::class, 'saveLivePhoto']);
          Route::post('/agent/agent-live-photo', [AgentController::class, 'saveAgentLivePhoto']);
        Route::post('/agent/application-document', [AgentController::class, 'saveApplicationDocument']);
        Route::post('/agent/account-personal-details', [AgentController::class, 'saveAccountPersonalDetails']);
        Route::post('/agent/account-nominee', [AgentController::class, 'saveAccountNominee']);
        Route::post('/agent/service-to-customer', [AgentController::class, 'saveServiceToCustomer']);
        Route::get('/agent/full-application-details/{id}', [AgentController::class, 'getFullApplicationDetails']);
        Route::get('/agent/applicationDetails/{id}', [AgentController::class, 'getApplicationDetails'])->name('enrollment.applicationDetails');
        //rekyc
        Route::post('/application/by-aadhar', [AgentController::class, 'getApplicationByAadhar']);
        Route::get('/agent/bankingServices', [AgentController::class, 'getBankingServices']);
        //Admin routes

        //This is for starting the KYC process by agent
        Route::post('/agent/kyc/start', [kycAgentController::class, 'startKyc']);
        Route::post('/agent/save-all-kyc-data', [kycAgentController::class, 'saveAllKycData']);
        Route::post('/agent/kycDocumentUpload', [kycAgentController::class, 'kycSaveApplicationDocument']);
        
        // applications for the agent
        Route::get('/agent/full-applications/{agent_id}', [AgentController::class, 'getFullApplicationsByAgent']);
        // kyc update for the application
        Route::post('/agent/update-kyc-document-status', [kycAgentController::class, 'updateKycDocumentStatus']);
        Route::post('/agent/update-kyc-after-vs-cbs-status', [kycAgentController::class, 'updateKycAfterVsCbsStatus']);
        // final table status change 
        Route::post('admin/kyc-application-status/update', [kycAgentController::class, 'updateKycApplicationStatus']);

        //This is for getting the application status by agent id
        Route::get('/agent/dashboardApplicationStatus/{agent_id}', [AgentController::class, 'getApplicationStatusByAgents']);

        

    // });

 

    // Route for all authenticated users
    Route::get('/user/profile', function (Request $request) {
        return response()->json($request->get('auth_user'));
    });
// });


