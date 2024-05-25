<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRequirement;
use App\Models\Follower;
use App\Models\Participant;
use App\Models\EventUser;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(30)->create();
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'is_Admin' => true,
        ]);

        Follower::factory(30)->create();
        $events = Event::factory(10)->create(['event_requirement_id' => null]);

        foreach ($events as $index => $event) {
            $eventRequirement = EventRequirement::factory()->create();
            $event->update(['event_requirement_id' => $eventRequirement->id]);
        }

        EventUser::factory(50)->create();

        
    }
}
