<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class kycApplicationDocument extends Model
{
    use HasFactory;

        protected $table = 'kyc_customer_document';

    protected $fillable = [
        'kyc_application_id',
        'kyc_application_no',
        'kyc_document_type',
        'kyc_document_type_id',
        'kyc_signature',
        'kyc_photo',
        'kyc_file_name',
        'kyc_file_path',
    ];
}
