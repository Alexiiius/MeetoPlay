<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GameMode>
 */
class GameModeFactory extends Factory
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
            'game_id' => \App\Models\Game::all()->random()->id,
            'scenario_name' => json_encode($this->faker->words(5)), // Genera un array de 5 palabras aleatorias
            'ranks' => json_encode([
                'diamante', 
                'plata', 
                'oro', 
                'platino',
                'bronce'
            ]),
            'min_players' => $this->faker->numberBetween(1, 10),
            'max_players' => $this->faker->numberBetween(1, 10),
            'ranked' => $this->faker->boolean()
        ];
    }
}
