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

        Game::factory()->create([
            'name' => 'League of Legends',
            'description' => 'League of Legends es un juego de estrategia en tiempo real en el que dos equipos de cinco campeones se enfrentan para destruir la base del otro equipo.',
            'nickname_name' => json_encode(['nick', 'nickname', 'apodo', 'nombre de usuario', 'nombre de invocador']),
            'account_level_name' => 'nivel de cuenta',
            'image' => 'https://www.muycomputer.com/wp-content/uploads/2020/10/league-of-legends-1.jpg',
        ]);

        Platform::factory()->create([
            'platform' => 'PC',
        ]);

        Platform::factory()->create([
            'platform' => 'PlayStation',
        ]);
        
        GameMode::factory()->create([
            'name' => 'Solo/Duo',
            'description' => 'Modo de juego en el que juegas solo y mal acompañado.',
            'game_id' => 1,
            'scenario_name' => json_encode(['Grieta del Invocador']),
            'ranks' => json_encode(['Hierro', 'Bronce', 'Plata', 'Oro', 'Platino', 'Diamante', 'Maestro', 'Gran Maestro', 'Challenger']),
            'min_players' => 1,
            'max_players' => 2,
            'ranked' => true,
        ]);

        GameMode::factory()->create([
            'name' => 'Flex',
            'description' => 'Modo de juego en el que juegas con amigos y tambien mal acompañado.',
            'game_id' => 1,
            'scenario_name' => json_encode(['Grieta del Invocador']),
            'ranks' => json_encode(['Hierro', 'Bronce', 'Plata', 'Oro', 'Platino', 'Diamante', 'Maestro', 'Gran Maestro', 'Challenger']),
            'min_players' => 1,
            'max_players' => 5,
            'ranked' => true,
        ]);

        //crear el vinculo en la tabla pivote game_platform

        DB::table('game_platform')->insert([
            'game_id' => 1,
            'platform_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('game_platform')->insert([
            'game_id' => 1,
            'platform_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);



        
        



    }
}
