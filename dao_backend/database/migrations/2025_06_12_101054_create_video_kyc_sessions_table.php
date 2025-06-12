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
    Schema::create('video_kyc_sessions', function (Blueprint $table) {
    $table->id();
    $table->string('application_id');
    $table->string('token')->unique();
    $table->string('client_email');
    $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
    $table->string('recording_url')->nullable();
    $table->timestamp('expires_at');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_kyc_sessions');
    }
};
