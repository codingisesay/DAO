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
        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id'); 
            $table->foreign('application_id')->references('id')->on('customer_application_details')->onDelete('cascade');
            $table->string('document_type')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_path')->nullable();
            $table->enum('status',['Approved','Reject'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_documents');
    }
};
