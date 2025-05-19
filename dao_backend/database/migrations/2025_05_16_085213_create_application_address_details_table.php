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
        Schema::create('application_address_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id'); 
            $table->foreign('application_id')->references('id')->on('customer_application_details')->onDelete('cascade');
            $table->string('per_complex_name')->nullable();
            $table->string('per_flat_no')->nullable();
            $table->string('per_area')->nullable();
            $table->string('per_landmark')->nullable();
            $table->string('per_country')->nullable();
            $table->string('per_pincode')->nullable();
            $table->string('per_city')->nullable();
            $table->string('per_district')->nullable();
            $table->string('per_state')->nullable();
            $table->string('per_resident')->nullable();
            $table->string('per_residence_status')->nullable();
            $table->string('resi_doc')->nullable();
            $table->string('cor_complex')->nullable();
            $table->string('cor_flat_no')->nullable();
            $table->string('cor_area')->nullable();
            $table->string('cor_landmark')->nullable();
            $table->string('cor_country')->nullable();
            $table->string('cor_pincode')->nullable();
            $table->string('cor_city')->nullable();
            $table->string('cor_district')->nullable();
            $table->string('cor_state')->nullable();
            $table->enum('status',['Approved','Reject'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_address_details');
    }
};
