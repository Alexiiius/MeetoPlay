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
        Schema::create('event_requirements', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('event_id')->unsigned()->index()->nullable();
            // $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->string('max_level')->nullable();
            $table->string('min_level')->nullable();
            $table->string('max_rank')->nullable();
            $table->string('min_rank')->nullable();
            $table->integer('min_hours_played')->nullable();
            $table->integer('max_hours_played')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_requirements');
    }
};
