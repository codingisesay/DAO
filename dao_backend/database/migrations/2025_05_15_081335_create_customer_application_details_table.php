<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_application_details', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->unique();
            $table->enum('auth_type', ['Pan Card','Aadhaar Card','Digilocker'])->nullable();
            $table->string('auth_code')->nullable();
            $table->string('auth_status')->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('DOB')->nullable();
            $table->enum('gender', ['Male','Female','Others'])->nullable();
            $table->string('mobile')->nullable();
            $table->string('complex_name')->nullable();
            $table->string('flat_no')->nullable();
            $table->string('area')->nullable();
            $table->string('lankmark')->nullable();
            $table->string('country')->nullable();
            $table->string('pincode')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('state')->nullable();
            $table->string('agent_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_application_details');
    }
};
