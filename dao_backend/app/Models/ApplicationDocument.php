<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationDocument extends Model
{
    use HasFactory;

    protected $table = 'application_documents';

    protected $fillable = [
        'application_id',
        'document_type',
        'document_type_id',
        'file_name',
        'file_path',
        'signature',
        'photo',
        'status',
    ];
}
