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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('game_id')->index();
            $table->string('game_pic');
            $table->string('game_name')->index();
            $table->integer('game_mode');
            $table->integer('platform')->index();
            $table->bigInteger('event_owner_id')->unsigned()->index();
            $table->foreign('event_owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->dateTime('date_time_begin');
            $table->dateTime('date_time_end');
            $table->dateTime('date_time_inscription_begin')->nullable();
            $table->dateTime('date_time_inscription_end')->nullable();
            $table->integer('max_participants');
            $table->string('privacy');
            $table->bigInteger('event_requirement_id')->unsigned()->index();
            $table->foreign('event_requirement_id')->references('id')->on('event_requirements')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
