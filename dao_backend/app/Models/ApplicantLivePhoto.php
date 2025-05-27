<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantLivePhoto extends Model
{
    use HasFactory;

    protected $table = 'applicant_live_photos';

    protected $fillable = [
        'application_id',
        'longitude',
        'latitude',
        'name',
        'path',
        'status',
    ];
}
