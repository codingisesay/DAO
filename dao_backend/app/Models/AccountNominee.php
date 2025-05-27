<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountNominee extends Model
{
    use HasFactory;

    protected $table = 'account_nominees';

    protected $fillable = [
        'application_id',
        'salutation',
        'first_name',
        'middle_name',
        'last_name',
        'relationship',
        'percentage',
        'dob',
        'age',
        'nom_complex_name',
        'nom_flat_no',
        'nom_area',
        'nom_landmark',
        'nom_country',
        'nom_pincode',
        'nom_city',
        'nom_state',
        'nom_district',
        'nom_mobile',
        'status',
    ];
}
