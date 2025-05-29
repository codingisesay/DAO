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
}