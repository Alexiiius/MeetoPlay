<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Game;
use App\Models\Platform;
use App\Models\Gamemode;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'nickname_name' => json_encode($this->faker->words(5)), // Genera un array de 5 palabras aleatorias
            'account_level_name' => $this->faker->word(),
            'image' => $this->faker->imageUrl(),
        ];
    }
}
