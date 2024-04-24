<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Platform;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Platform>
 */
class PlatformFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'platform' => $this->faker->unique()->randomElement([
                'PC',
                'PlayStation',
                'Xbox',
                'Nintendo',
                'Mobile',
                'VR',
                'Other'
            ])
        ];
    }
}
