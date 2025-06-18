<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycApplicationStatus extends Model
{
    use HasFactory;

    protected $table = 'kyc_application_status';  // Table name
    protected $fillable = ['kyc_application_id', 'status'];  // Columns to allow mass assignment
}