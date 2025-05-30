<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Services\EurekaService;
use App\Http\Controllers\Api\AuthProxyController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AdminController;


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



// Route::middleware(['jwt.auth'])->group(function () {

    // Route::middleware('role:admin')->group(function () {
    //     Route::get('/admin/dashboard', fn() => response()->json(['message' => 'Welcome Admin']));
    // });

    // Route::middleware('role:agent')->group(function () {
        Route::post('/agent/accounts', [AgentController::class, 'handleAccounts']);
        Route::post('/agent/enrollment', [AgentController::class, 'EnrollmentDetails'])->name('enrollment.details');
        Route::post('/agent/personal-details', [AgentController::class, 'savePersonalDetails']);
        Route::post('/agent/address-details', [AgentController::class, 'saveAddressDetails']);
        Route::post('/agent/live-photo', [AgentController::class, 'saveLivePhoto']);
        Route::post('/agent/application-document', [AgentController::class, 'saveApplicationDocument']);
        Route::post('/agent/account-personal-details', [AgentController::class, 'saveAccountPersonalDetails']);
        Route::post('/agent/account-nominee', [AgentController::class, 'saveAccountNominee']);
        Route::post('/agent/service-to-customer', [AgentController::class, 'saveServiceToCustomer']);
        Route::get('/agent/full-application-details/{id}', [AgentController::class, 'getFullApplicationDetails']);
        Route::get('/agent/applicationDetails/{id}', [AgentController::class, 'getApplicationDetails'])->name('enrollment.applicationDetails');
        //rekyc
        Route::post('/application/by-aadhar', [AgentController::class, 'getApplicationByAadhar']);
        //Admin routes
        Route::get('/admin/applications', [AdminController::class, 'getAllApplications']);
        Route::get('/admin/applications/pending', [AdminController::class, 'getAllApplicationsPending']);
        Route::get('/admin/applications/rejected', [AdminController::class, 'getAllApplicationsRejected']);
        // Update status for customer_application_details
        Route::post('/admin/application/update-status', [AdminController::class, 'updateApplicationStatus']);
        // Update status for application_personal_details
        Route::post('/admin/personal-details/update-status', [AdminController::class, 'updatePersonalDetailsStatus']);
        // Update status for application_documents
        Route::post('/admin/documents/update-status', [AdminController::class, 'updateDocumentsStatus']);
        // Update status for application_address_details
        Route::post('/admin/address-details/update-status', [AdminController::class, 'updateAddressDetailsStatus']);
        // Update status for applicant_live_photos
        Route::post('/admin/live-photos/update-status', [AdminController::class, 'updateLivePhotosStatus']);
        // Update status for account_personal_details
        Route::post('/admin/account-personal-details/update-status', [AdminController::class, 'updateAccountPersonalDetailsStatus']);
        // Update status for account_nominees
        Route::post('/admin/nominees/update-status', [AdminController::class, 'updateNomineesStatus']);
        // get the data after clicking view button in admin panel
        Route::get('/admin/application-details/{id}', [AdminController::class, 'getFullApplicationDetails']);
    // });

    Route::middleware('role:employee,admin')->group(function () {
        Route::get('/employee/tasks', [App\Http\Controllers\EmployeeController::class, 'getTasks']);
    });

    // Route for all authenticated users
    Route::get('/user/profile', function (Request $request) {
        return response()->json($request->get('auth_user'));
    });
// });


