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
        Schema::create('storage_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // local, google_drive, dropbox, etc.
            $table->json('credentials')->nullable();
            $table->unsignedBigInteger('quota'); // in bytes
            $table->unsignedBigInteger('used'); // in bytes
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('storage_providers');
    }
};
