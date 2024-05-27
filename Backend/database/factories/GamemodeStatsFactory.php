<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\GamemodeStats;
use App\Models\GameUserStats;
use App\Models\User;


class GamemodeStatsFactory extends Factory {

    public function definition(): array {

        //keep generating random if the combination already exists 3 times
        //because a game id can have multiple gamemodes
        do {
            $game_user_stats_id = GameUserStats::all()->random()->id;
            $user_id = User::all()->random()->id;
            $count = GamemodeStats::where('game_user_stats_id', $game_user_stats_id)->where('user_id', $user_id)->count();
        } while ($count >= 3);
    
        return [
            'user_id' => $user_id,
            'game_user_stats_id' => $game_user_stats_id,
            'gamemode_name' => $this->faker->word(),
            'gamemodes_rank' => $this->faker->word()
        ];
    }
}
