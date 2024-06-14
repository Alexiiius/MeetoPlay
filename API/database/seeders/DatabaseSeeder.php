<?php

namespace Database\Seeders;

use App\Models\User;


use App\Models\Game;
use App\Models\GameMode;
use App\Models\Platform;
use Illuminate\Support\Facades\DB;


// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
        ]);

        // Platform::factory(7)->create();
        // Game::factory(10)->create();
        // GameMode::factory(10)->create();

        Platform::insert([
            ['platform' => 'PC'],
            ['platform' => 'PlayStation'],
            ['platform' => 'Xbox'],
            ['platform' => 'Nintendo Switch'],
            ['platform' => 'Mobile'],
            ['platform' => 'Offline'],
            ['platform' => 'Crossplay'],
            ['platform' => 'Other'],
        ]);


        Game::factory()->create([
            'name' => 'League of Legends',
            'description' => 'League of Legends is a team-based game with over 140 champions to make epic plays with.',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username', 'summoners name']),
            'account_level_name' => 'Account level',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/League_of_Legends.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Solo/Duo',
            'description' => 'Competitive game mode for 1 or 2 players.',
            'game_id' => 1,
            'scenario_name' => json_encode(['Summoners Rift']),
            'ranks' => json_encode(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger']),
            'min_players' => 1,
            'max_players' => 2,
            'ranked' => true,
        ]);

        GameMode::factory()->create([
            'name' => 'Flex',
            'description' => 'Competitive game mode for 1 to 5 players.',
            'game_id' => 1,
            'scenario_name' => json_encode(['Summoners Rift']),
            'ranks' => json_encode(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => true,
        ]);

        Gamemode::factory()->create([
            'name' => 'ARAM',
            'description' => 'Game mode in which you play with a random champion on a single lane map',
            'game_id' => 1,
            'scenario_name' => json_encode(['ARAM']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => false,
        ]);

        Gamemode::factory()->create([
            'name' => 'URF',
            'description' => 'Game mode in which you can play with any champion and with infinite abilities.',
            'game_id' => 1,
            'scenario_name' => json_encode(['URF']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => false,
        ]);

        Gamemode::factory()->create([
            'name' => 'TFT',
            'description' => 'Game mode in which you play with a random champion on a single lane map',
            'game_id' => 1,
            'scenario_name' => json_encode(['TFT']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 8,
            'ranked' => false,
        ]);

        Gamemode::factory()->create([
            'name' => 'Clash',
            'description' => 'Game mode in which you play with a random champion on a single lane map',
            'game_id' => 1,
            'scenario_name' => json_encode(['Summoners Rift']),
            'ranks' => json_encode(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger']),
            'min_players' => 5,
            'max_players' => 5,
            'ranked' => true,
        ]);

        Gamemode::factory()->create([
            'name' => 'Normal',
            'description' => 'Game mode in which you play with a random champion on a map',
            'game_id' => 1,
            'scenario_name' => json_encode(['Summoners Rift', 'ARAM']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => false,
        ]);

        //crear el vinculo en la tabla pivote game_platform

        DB::table('game_platform')->insert([
            'game_id' => 1,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Game::factory()->create([
            'name' => 'MineCraft',
            'description' => 'Minecraft is a game about placing blocks and going on adventures.',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username']),
            'account_level_name' => 'Account level',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/Minecraft.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Survival',
            'description' => 'Game mode in which you have to survive and build your own world.',
            'game_id' => 2,
            'scenario_name' => json_encode(['Survival']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 10,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Creative',
            'description' => 'Game mode in which you can build whatever you want.',
            'game_id' => 2,
            'scenario_name' => json_encode(['Creative']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 10,
            'ranked' => false,
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 6,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 2,
            'platform_id' => 7,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ----------------------------------------------------------------------------------------

        Game::factory()->create([
            'name' => 'Apex Legends',
            'description' => '',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username']),
            'account_level_name' => '',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/Apex_Legends.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Battle Royale - Trios',
            'description' => '',
            'game_id' => 3,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 3,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Battle Royale - Solo',
            'description' => '',
            'game_id' => 3,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 1,
            'ranked' => false,
        ]);


        GameMode::factory()->create([
            'name' => 'Ranked League',
            'description' => '',
            'game_id' => 3,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Apex Predator']),
            'min_players' => 1,
            'max_players' => 3,
            'ranked' => true,
        ]);

        GameMode::factory()->create([
            'name' => 'Mixtape',
            'description' => '',
            'game_id' => 3,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 3,
            'ranked' => false,
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 3,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 3,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 3,
            'platform_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 3,
            'platform_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 3,
            'platform_id' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 3,
            'platform_id' => 7,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // ----------------------------------------------------------------------------------------


        Game::factory()->create([
            'name' => 'Overwatch',
            'description' => '',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username']),
            'account_level_name' => '',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/Overwatch.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Quick Play',
            'description' => '',
            'game_id' => 4,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 6,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Competitive game',
            'description' => '',
            'game_id' => 4,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Top 500']),
            'min_players' => 1,
            'max_players' => 6,
            'ranked' => true,
        ]);

        GameMode::factory()->create([
            'name' => 'Arcade',
            'description' => '',
            'game_id' => 4,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 6,
            'ranked' => false,
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 4,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 4,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 4,
            'platform_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 4,
            'platform_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        //----------------------------------------------------------------------------------------

        Game::factory()->create([
            'name' => 'Among Us',
            'description' => '',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username']),
            'account_level_name' => '',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/Among_Us.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Public',
            'description' => '',
            'game_id' => 5,
            'scenario_name' => json_encode(['The Skeld', 'Mira HQ']),
            'ranks' => json_encode(['']),
            'min_players' => 4,
            'max_players' => 10,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Private',
            'description' => '',
            'game_id' => 5,
            'scenario_name' => json_encode(['The Skeld', 'Mira HQ']),
            'ranks' => json_encode(['']),
            'min_players' => 4,
            'max_players' => 10,
            'ranked' => false,
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 5,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 5,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 5,
            'platform_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 5,
            'platform_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 5,
            'platform_id' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        //----------------------------------------------------------------------------------------

        Game::factory()->create([
            'name' => 'Fortnite',
            'description' => '',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username']),
            'account_level_name' => '',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/Fortnite.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Battle Royale',
            'description' => '',
            'game_id' => 6,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 3,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Creative Sandbox',
            'description' => '',
            'game_id' => 6,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 16,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Save the World',
            'description' => '',
            'game_id' => 6,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 4,
            'ranked' => false,
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 6,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 6,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 6,
            'platform_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 6,
            'platform_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 6,
            'platform_id' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 6,
            'platform_id' => 7,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        //----------------------------------------------------------------------------------------

        Game::factory()->create([
            'name' => 'Valorant',
            'description' => '',
            'nickname_name' => json_encode(['nick', 'nickname', 'alias', 'username']),
            'account_level_name' => '',
            'image' => 'https://meetoplay-api-assets-bucket.s3.amazonaws.com/gameLogos/Valorant+2.png',
        ]);

        GameMode::factory()->create([
            'name' => 'Unrated',
            'description' => '',
            'game_id' => 7,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => false,
        ]);

        GameMode::factory()->create([
            'name' => 'Competitive',
            'description' => '',
            'game_id' => 7,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => true,
        ]);

        GameMode::factory()->create([
            'name' => 'Spike Rush',
            'description' => '',
            'game_id' => 7,
            'scenario_name' => json_encode(['']),
            'ranks' => json_encode(['']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => false,
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 7,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 7,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 7,
            'platform_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
