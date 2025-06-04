<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountPersonalDetail extends Model
{
    use HasFactory;

    protected $table = 'account_personal_details';

    protected $fillable = [
          'maiden_prefix',
        'maiden_first_name',
        'maiden_middle_name',
        'maiden_last_name',
        'application_id',
        'father_prefix_name',
        'father_first_name',
        'father_middle_name',
        'father_last_name',
        'mother_prefix_name',
        'mother_first_name',
        'mother_middle_name',
        'mother_last_name',
        'birth_place',
        'birth_country',
        'occoupation_type',
        'occupation_name',
        'if_salaryed',
        'designation',
        'nature_of_occoupation',
        'qualification',
        'anual_income',
        'remark',
        'status',
    ];
}
