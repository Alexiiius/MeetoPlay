<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_title' => $this->faker->sentence,
            'game_id' => $this->faker->numberBetween(1, 100),
            'game_pic' => $this->faker->imageUrl(),
            'game_name' => $this->faker->word,
            'game_mode' => $this->faker->word,
            'platform' => $this->faker->randomElement(['pc', 'xbox', 'nintendo', 'mobile', 'crossplay', 'otros']),
            'event_owner_id' => DB::table('users')->inRandomOrder()->first()->id,
            'date_time_begin' => $this->faker->dateTime,
            'date_time_end' => $this->faker->dateTime,
            'date_time_inscription_begin' => $this->faker->dateTime,
            'date_time_inscription_end' => $this->faker->dateTime,
            'max_participants' => $this->faker->numberBetween(1, 50),
            'privacy' => $this->faker->randomElement(['public', 'hidden', 'friends', 'followers']),
            'event_requirement_id' => 1,
        ];
    }
}
