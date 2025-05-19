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
        Schema::create('service_to_customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id'); 
            $table->foreign('application_id')->references('id')->on('customer_application_details')->onDelete('cascade');
            $table->unsignedBigInteger('banking_services_id'); 
            $table->foreign('banking_services_id')->references('id')->on('banking_services')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_to_customers');
    }
};
