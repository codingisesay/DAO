<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationAddressDetails extends Model
{
    use HasFactory;

    protected $table = 'application_address_details';

    protected $fillable = [
        'application_id',
        'per_complex_name',
        'per_flat_no',
        'per_area',
        'per_landmark',
        'per_country',
        'per_pincode',
        'per_city',
        'per_district',
        'per_state',
        'per_resident',
        'per_residence_status',
        'resi_doc',
        'cor_complex',
        'cor_flat_no',
        'cor_area',
        'cor_landmark',
        'cor_country',
        'cor_pincode',
        'cor_city',
        'cor_district',
        'cor_state',
        'status',
    ];
}
