<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationPersonalDetails extends Model
{
    use HasFactory;

    protected $table = 'application_personal_details';

    protected $fillable = [
        'application_id',
        'salutation',
        'religion',
        'caste',
        'marital_status',
        'alt_mob_no',
        'email',
        'adhar_card',
        'pan_card',
        'passport',
        'driving_license',
        'voter_id',
        'status',
        'firstname',
        'middlename',
        'lastname',
        'dateofbirth',
        'gender', 
    ];
}
