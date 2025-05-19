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
        Schema::create('application_personal_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id'); 
            $table->foreign('application_id')->references('id')->on('customer_application_details')->onDelete('cascade');
            $table->enum('salutation',['Mr','Mrs'])->nullable();
            $table->enum('religion',['Hindu','Muslim'])->nullable();
            $table->string('caste')->nullable();
            $table->enum('marital_status',['Married','Single'])->nullable();
            $table->string('alt_mob_no')->nullable();
            $table->string('email')->nullable();
            $table->string('adhar_card')->nullable();
            $table->string('pan_card')->nullable();
            $table->string('passport')->nullable();
            $table->string('driving_license')->nullable();
            $table->string('voter_id')->nullable();
            $table->enum('status',['Approved','Reject'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_personal_details');
    }
};
