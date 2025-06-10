<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerApplicationStatus extends Model
{
    use HasFactory;
     protected $table = 'customer_appliction_status';
      protected $fillable = [
        'application_id',
        'status',
        
    ];
}
