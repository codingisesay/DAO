<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerApplicationDetail extends Model
{
    use HasFactory;

    protected $table = 'customer_application_details';

    protected $fillable = [
        'application_no',
        'auth_type',
        'auth_code',
        'auth_status',
        'first_name',
        'middle_name',
        'last_name',
        'DOB',
        'gender',
        'mobile',
        'complex_name',
        'flat_no',
        'area',
        'landmark',
        'country',
        'pincode',
        'city',
        'district',
        'state',
        'status',
        'agent_id',
    ];
    protected $casts = [
        'DOB' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];


}
