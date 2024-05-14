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
        $events = Event::factory(1)->create(['event_requirement_id' => null]);
        $event = $events[0];
        $eventRequirement = EventRequirement::create([
            'event_id' => 1,
            'max_level' => '10',
            'min_level' => '1',
            'max_rank' => 'Diamond',
            'min_rank' => 'Iron',
            'min_hours_played' => 100,
            'max_hours_played' => 1000,
        ]);
        $event->update(['event_requirement_id' => $eventRequirement->id]);
        Event::factory(10)->create();
        EventUser::factory(50)->create();

        
    }
}
