<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Encryption\Encrypter;

class ApplicationPersonalDetails extends Model
{
    use HasFactory;

    protected $table = 'application_personal_details';

    protected $fillable = [
        'application_id',
        'salutation',
        'religion',
        'caste',
        'marital_status',
        'alt_mob_no',
        'email',
        'adhar_card',
        'pan_card',
        'passport',
        'driving_license',
        'voter_id',
        'status',
        'firstname',
        'middlename',
        'lastname',
        'dateofbirth',
        'gender', 
    ];

    protected $casts = [
        'alt_mob_no' => 'encrypted',
        'email' => 'encrypted',
        'adhar_card' => 'encrypted',
        'pan_card' => 'encrypted',
        'passport' => 'encrypted',
        'voter_id' => 'encrypted',
    ];

    public function getAltMobNoAttribute($value)
    {
        return decrypt($value);
    }

    public function getEmailAttribute($value)
    {
        return decrypt($value);
    }

    public function getAdharCardAttribute($value)
    {
        return decrypt($value);
    }

    public function getPanCardAttribute($value)
    {
        return decrypt($value);
    }

    public function getPassportAttribute($value)
    {
        return decrypt($value);
    }

    public function getVoterIdAttribute($value)
    {
        return decrypt($value);
    }

    public function setAltMobNoAttribute($value)
    {
        $this->attributes['alt_mob_no'] = encrypt($value);
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = encrypt($value);
    }

    public function setAdharCardAttribute($value)
    {
        $this->attributes['adhar_card'] = encrypt($value);
    }

    public function setPanCardAttribute($value)
    {
        $this->attributes['pan_card'] = encrypt($value);
    }

    public function setPassportAttribute($value)
    {
        $this->attributes['passport'] = encrypt($value);
    }

    public function setVoterIdAttribute($value)
    {
        $this->attributes['voter_id'] = encrypt($value);
    }
}
