<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentLivePhoto extends Model
{
    use HasFactory;

        protected $table = 'agent_live_photos';
 
    protected $fillable = [
        'application_id',
        'longitude',
        'latitude',
        'name',
        'path',
        'status',
        'status_comment',
    ];
}
