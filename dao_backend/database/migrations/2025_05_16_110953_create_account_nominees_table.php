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
        Schema::create('account_nominees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id'); 
            $table->foreign('application_id')->references('id')->on('customer_application_details')->onDelete('cascade');
            $table->enum('salutation',['Mr','Mrs','Miss'])->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('relationship')->nullable();
            $table->string('percentage')->nullable();
            $table->date('dob')->nullable();
            $table->string('age')->nullable();
            $table->string('nom_complex_name')->nullable();
            $table->string('nom_flat_no')->nullable();
            $table->string('nom_area')->nullable();
            $table->string('nom_landmark')->nullable();
            $table->string('nom_country')->nullable();
            $table->string('nom_pincode')->nullable();
            $table->string('nom_city')->nullable();
            $table->string('nom_state')->nullable();
            $table->string('nom_district')->nullable();
            $table->string('nom_mobile')->nullable();
            $table->enum('status',['Approved','Reject'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_nominees');
    }
};
