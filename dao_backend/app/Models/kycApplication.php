<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class kycApplication extends Model
{
    use HasFactory;
    protected $table = 'kyc_application';
    protected $fillable = [
        'verify_from',
        'kyc_application_no',
        'verify_details',
        'kyc_agent_id',
       
    ];
}
