<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getAllApplications()
    {
        // Fetch all applications where status is 'APPROVED' in customer_application_details
        $applications = DB::table('customer_application_details')
            // ->where('status', 'APPROVED')
            ->get();

        $result = [];
        foreach ($applications as $app) {
            $app->personal_details = DB::table('application_personal_details')
                ->where('application_id', $app->id)
                ->where('status', 'APPROVED')
                ->first();

            $app->documents = DB::table('application_documents')
                ->where('application_id', $app->id)
                ->where('status', 'APPROVED')
                ->get();

            $app->addresses = DB::table('application_address_details')
                ->where('application_id', $app->id)
                ->where('status', 'APPROVED')
                ->get();

            $app->live_photos = DB::table('applicant_live_photos')
                ->where('application_id', $app->id)
                ->where('status', 'APPROVED')
                ->get();

            $app->account_personal_details = DB::table('account_personal_details')
                ->where('application_id', $app->id)
                ->where('status', 'APPROVED')
                ->first();

            $app->nominees = DB::table('account_nominees')
                ->where('application_id', $app->id)
                ->where('status', 'APPROVED')
                ->get();

            $result[] = $app;
        }

        return response()->json([
            'message' => 'All approved applications fetched successfully.',
            'data' => $result
        ]);
    }


       public function getAllApplicationsPending()
    {
        // Fetch all applications where status is 'PENDING' in customer_application_details
        $applications = DB::table('customer_application_details')
            // ->where('status', 'PENDING')
            ->get();

        $result = [];
        foreach ($applications as $app) {
            $app->personal_details = DB::table('application_personal_details')
                ->where('application_id', $app->id)
                ->where('status', 'PENDING')
                ->first();

            $app->documents = DB::table('application_documents')
                ->where('application_id', $app->id)
                ->where('status', 'PENDING')
                ->get();

            $app->addresses = DB::table('application_address_details')
                ->where('application_id', $app->id)
                ->where('status', 'PENDING')
                ->get();

            $app->live_photos = DB::table('applicant_live_photos')
                ->where('application_id', $app->id)
                ->where('status', 'PENDING')
                ->get();

            $app->account_personal_details = DB::table('account_personal_details')
                ->where('application_id', $app->id)
                ->where('status', 'PENDING')
                ->first();

            $app->nominees = DB::table('account_nominees')
                ->where('application_id', $app->id)
                ->where('status', 'PENDING')
                ->get();

            $result[] = $app;
        }

        return response()->json([
            'message' => 'All pending applications fetched successfully.',
            'data' => $result
        ]);
    }

    public function getAllApplicationsRejected()
{
    // Fetch all applications where status is 'REJECT' in customer_application_details
    $applications = DB::table('customer_application_details')
        // ->where('status', 'REJECT')
        ->get();

    $result = [];
    foreach ($applications as $app) {
        $app->personal_details = DB::table('application_personal_details')
            ->where('application_id', $app->id)
            ->where('status', 'REJECT')
            ->first();

        $app->documents = DB::table('application_documents')
            ->where('application_id', $app->id)
            ->where('status', 'REJECT')
            ->get();

        $app->addresses = DB::table('application_address_details')
            ->where('application_id', $app->id)
            ->where('status', 'REJECT')
            ->get();

        $app->live_photos = DB::table('applicant_live_photos')
            ->where('application_id', $app->id)
            ->where('status', 'REJECT')
            ->get();

        $app->account_personal_details = DB::table('account_personal_details')
            ->where('application_id', $app->id)
            ->where('status', 'REJECT')
            ->first();

        $app->nominees = DB::table('account_nominees')
            ->where('application_id', $app->id)
            ->where('status', 'REJECT')
            ->get();

        $result[] = $app;
    }

    return response()->json([
        'message' => 'All rejected applications fetched successfully.',
        'data' => $result
    ]);
}

public function updateApplicationStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('customer_application_details')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Application status updated successfully.']);
}

public function updatePersonalDetailsStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('application_personal_details')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Personal details status updated successfully.']);
}

public function updateDocumentsStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('application_documents')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Document status updated successfully.']);
}

public function updateAddressDetailsStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('application_address_details')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Address details status updated successfully.']);
}

public function updateLivePhotosStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('applicant_live_photos')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Live photo status updated successfully.']);
}

public function updateAccountPersonalDetailsStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('account_personal_details')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Account personal details status updated successfully.']);
}

public function updateNomineesStatus(Request $request)
{
    $request->validate([
        'id' => 'required|integer',
        'status' => 'required|string'
    ]);

    DB::table('account_nominees')
        ->where('id', $request->id)
        ->update(['status' => $request->status]);

    return response()->json(['message' => 'Nominee status updated successfully.']);
}

// Fetch full application details including all related data after clicking on view button in admin panel
public function getFullApplicationDetails($id)
{
    // Fetch main application
    $app = DB::table('customer_application_details')->where('id', $id)->first();

    if (!$app) {
        return response()->json(['message' => 'Application not found.'], 404);
    }

    // Fetch related data
    $app->personal_details = DB::table('application_personal_details')
        ->where('application_id', $id)
        ->first();

    $app->documents = DB::table('application_documents')
        ->where('application_id', $id)
        ->get();

    $app->addresses = DB::table('application_address_details')
        ->where('application_id', $id)
        ->get();

    $app->live_photos = DB::table('applicant_live_photos')
        ->where('application_id', $id)
        ->get();

    $app->account_personal_details = DB::table('account_personal_details')
        ->where('application_id', $id)
        ->first();

    $app->nominees = DB::table('account_nominees')
        ->where('application_id', $id)
        ->get();

    return response()->json([
        'message' => 'Application details fetched successfully.',
        'data' => $app
    ]);
}

}