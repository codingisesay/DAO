<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceToCustomer extends Model
{
    use HasFactory;

    
    protected $table = 'service_to_customers';

    protected $fillable = [
        'application_id',
        'banking_services_id',
    ];
}
