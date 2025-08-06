<?php

// Create a new controller, e.g., PdfController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class PdfController extends Controller
{
public function generateApplicationPdf($applicationId)
{
    // Step 1: Get all table names and their corresponding data
    $tables = [
        'account_nominees' => AccountNominee::where('application_id', $applicationId)->first(),
        'account_personal_details' => AccountPersonalDetail::where('application_id', $applicationId)->first(),
        'agent_live_photos' => AgentLivePhoto::where('application_id', $applicationId)->first(),
        'applicant_live_photos' => ApplicantLivePhoto::where('application_id', $applicationId)->first(),
        'application_address_details' => ApplicationAddressDetail::where('application_id', $applicationId)->first(),
        'application_documents' => ApplicationDocument::where('application_id', $applicationId)->first(),
        'application_personal_details' => ApplicationPersonalDetail::where('application_id', $applicationId)->first(),
        'application_service_status' => ApplicationServiceStatus::where('application_id', $applicationId)->first(),
        'banking_services' => BankingService::where('application_id', $applicationId)->first(),
        'banking_services_facilities' => BankingServiceFacility::where('application_id', $applicationId)->first(),
        'customer_application_details' => CustomerApplicationDetail::where('application_id', $applicationId)->first(),
        'customer_application_status' => CustomerApplicationStatus::where('application_id', $applicationId)->first(),
    ];

    // Step 2: Set the data in a proper manner for the PDF
    $pdfData = [];
    foreach ($tables as $tableName => $tableData) {
        $pdfData[$tableName] = [
            'header' => $this->getPdfHeader($tableName),
            'data' => $this->getPdfData($tableName, $tableData),
        ];
    }

    // Step 3: Generate the PDF with password protection
    $pdf = $this->createPdf($pdfData, 'application_pdf.pdf', 'your_password');

    // Step 4: Return the PDF as a response
    return response()->download($pdf);
}

// Helper function to get the header for each table in the PDF
private function getPdfHeader($tableName)
{
    // Return the header for the given table
    switch ($tableName) {
        case 'account_nominees':
            return ['Nominee Name', 'Nominee Address', 'Nominee Phone'];
        case 'account_personal_details':
            return ['Account Holder Name', 'Account Holder Address', 'Account Holder Phone'];
        // Add more cases for each table
        default:
            return [];
    }
}
// Helper function to get the data for each table in the PDF
private function getPdfData($tableName, $tableData)
{
    // Return the data for the given table
    switch ($tableName) {
        case 'account_nominees':
            return [
                ['Nominee Name' => $tableData->nominee_name, 'Nominee Address' => $tableData->nominee_address, 'Nominee Phone' => $tableData->nominee_phone],
            ];
        case 'account_personal_details':
            return [
                ['Account Holder Name' => $tableData->account_holder_name, 'Account Holder Address' => $tableData->account_holder_address, 'Account Holder Phone' => $tableData->account_holder_phone],
            ];
        // Add more cases for each table
        default:
            return [];
    }
}

// Helper function to create the PDF
private function createPdf($pdfData, $filename, $password)
{
    // Use a library like Tcpdf to create the PDF
    $pdf = new Tcpdf();
    $pdf->SetProtection(array('print', 'copy', 'modify'), 'password', $password);
    // Add pages and content to the PDF
    // ...
    $pdf->Output($filename, 'D');
    return $pdf;
}

}