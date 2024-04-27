<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller{
    


    public function index(){
        Game::all();
        return response()->json(Game::all());
    }

    public function gamemodes(string $id){
        $game = Game::find($id);
        return response()->json($game->gamemodes);
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
