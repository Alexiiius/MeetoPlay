<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\EventRequirement;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventRequirement>
 */
class EventRequirementFactory extends Factory {


    public function definition(): array {
        return [
            'event_id' => null,
            'max_level' => $this->faker->numberBetween(1, 100),
            'min_level' => $this->faker->numberBetween(1, 100),
            'max_rank' => $this->faker->word,
            'min_rank' => $this->faker->word,
            'min_hours_played' => $this->faker->numberBetween(1, 100),
            'max_hours_played' => $this->faker->numberBetween(1, 100),
        ];
    }
}
