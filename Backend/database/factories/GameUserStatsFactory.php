<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\GameUserStats;
use App\Models\User;

class GameUserStatsFactory extends Factory {

    public function definition(): array {


        $game_id = $this->faker->numberBetween(1, 100);
        $user_id = User::all()->random()->id;
        
        while (GameUserStats::where('game_id', $game_id)->where('user_id', $user_id)->exists()) {
            $game_id = $this->faker->numberBetween(1, 100);
            $user_id = User::all()->random()->id;
        }
        
        return [
            'game_id' => $game_id,
            'user_id' => $user_id,
            'game_name' => $this->faker->word(),
            'hours_played' => $this->faker->numberBetween(1, 1000),
            'lv_account' => $this->faker->numberBetween(1, 100),
            'nickname_game' => $this->faker->word(),
            'game_pic' => $this->faker->imageUrl()
        ];

    }
}
