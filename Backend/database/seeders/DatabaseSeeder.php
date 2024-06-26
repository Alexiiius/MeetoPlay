<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRequirement;
use App\Models\Follower;
use App\Models\Participant;
use App\Models\EventUser;
use App\Models\GameUserStats;
use App\Models\GamemodeStats;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin2@admin.com',
            'password' => bcrypt('password'),
            'is_Admin' => true,
        ]);
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'is_Admin' => true,
        ]);
        User::factory(30)->create();

        Follower::factory(30)->create();
        $events = Event::factory(50)->create(['event_requirement_id' => null]);

        foreach ($events as $index => $event) {
            $eventRequirement = EventRequirement::factory()->create();
            $event->update(['event_requirement_id' => $eventRequirement->id]);
        }

        EventUser::factory(50)->create();
        GameUserStats::factory(50)->create();
        GamemodeStats::factory(50)->create();


    }
}
