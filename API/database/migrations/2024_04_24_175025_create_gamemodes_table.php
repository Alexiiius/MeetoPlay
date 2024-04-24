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
        Schema::create('gamemodes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->index();
            $table->string('description')->nullable();
            $table->boolean('ranked')->default(false);
            $table->integer('max_players');
            $table->integer('min_players')->default(1);
            $table->json('ranks');
            $table->json('scenario_name')->nullable();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gamemodes');
    }
};
