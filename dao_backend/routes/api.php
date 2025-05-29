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
    // });

    Route::middleware('role:employee,admin')->group(function () {
        Route::get('/employee/tasks', [App\Http\Controllers\EmployeeController::class, 'getTasks']);
    });

    // Route for all authenticated users
    Route::get('/user/profile', function (Request $request) {
        return response()->json($request->get('auth_user'));
    });
// });

