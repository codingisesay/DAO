<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoKycSession extends Model
{
     use HasFactory;
    
    protected $table = 'video_kyc_sessions';

    protected $fillable = [
        'application_id',
        'token',
        'status',
        'recording_url',
        'expires_at',
    ];
}
