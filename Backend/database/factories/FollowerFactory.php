<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Follower>
 */
class FollowerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        $users = User::all();
        $follower = $users->random();
        $followed = $users->where('id', '!=', $follower->id)->random();

        return [
            'user_id' => $followed->id,
            'follower_id' => $follower->id,
        ];
    }
}
