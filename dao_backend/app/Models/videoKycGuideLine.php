<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class videoKycGuideLine extends Model
{
    use HasFactory;
    
    protected $table = 'video_kyc_guidelines';

    protected $fillable = [
        'application_id',
        'status',
    ];
}
