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
        Schema::create('account_personal_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('application_id'); 
            $table->foreign('application_id')->references('id')->on('customer_application_details')->onDelete('cascade');
            $table->enum('father_prefix_name',['Mr','Mrs'])->nullable();
            $table->string('father_first_name')->nullable();
            $table->string('father_middle_name')->nullable();
            $table->string('father_last_name')->nullable();
            $table->enum('mother_prefix_name',['Mr','Mrs'])->nullable();
            $table->string('mother_first_name')->nullable();
            $table->string('mother_middle_name')->nullable();
            $table->string('mother_last_name')->nullable();
            $table->string('birth_place')->nullable();
            $table->string('birth_country')->nullable();
            $table->string('occoupation_type')->nullable();
            $table->string('occupation_name')->nullable();
            $table->enum('if_salaryed',['Yes','No'])->nullable();
            $table->string('designation')->nullable();
            $table->string('nature_of_occoupation')->nullable();
            $table->string('qualification')->nullable();
            $table->string('anual_income')->nullable();
            $table->string('remark')->nullable();
            $table->enum('status',['Approved','Reject'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_personal_details');
    }
};
