<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller{
    


    //return id, name and image of all games
    public function index(){
        $games = Game::select('id', 'name', 'image')->get();
        return response()->json($games);
    }

    // return gamemodes of a game by id of the game
    public function gamemodes(string $id){
        $game = Game::find($id);
        return response()->json($game->gamemodes);
    }


    // return platforms of a game by id of the game
    public function platform(string $id){
        $game = Game::find($id);
        if ($game) {
            foreach ($game->platforms as $platform) {
                $platform->makeHidden(['created_at', 'updated_at', 'pivot']);
            }
        }
        return $game->platforms;
    }
    

    public function show(string $id){
        $game = Game::with('gamemodes')->find($id);
    
        if ($game) {
            $game->platforms = $this->platform($id);
            $game->nickname_name = json_decode($game->nickname_name);
            $game->makeHidden(['created_at', 'updated_at']); 
            foreach ($game->gamemodes as $gamemode) {
                $gamemode->ranks = json_decode($gamemode->ranks);
                $gamemode->scenario_name = json_decode($gamemode->scenario_name);
                $gamemode->makeHidden(['created_at', 'updated_at']);
            }
        }
    
        return response()->json(['game' => $game]);
    }

    public function store(Request $request){
        $game = new Game();
        $game->name = $request->name;
        $game->description = $request->description;
        $game->image = $request->image;
        $game->save();
        return response()->json($game);
    }

    
}
