<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use App\Models\EventUser;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventUser>
 */
class EventUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        do {
            $event_id = DB::table('events')->inRandomOrder()->first()->id;
            $user_id = DB::table('users')->inRandomOrder()->first()->id;
        } while (DB::table('event_users')->where('event_id', $event_id)->where('user_id', $user_id)->exists() == false);
    
        return [
            'event_id' => $event_id,
            'user_id' => $user_id,
        ];
    }
}
