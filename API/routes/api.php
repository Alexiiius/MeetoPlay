<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;


//--------------Public routes----------------

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

//all games name, id and image
Route::get('/games', [GameController::class, 'index']);

//full game details, including gamemodes and platforms
Route::get('/game/{id}', [GameController::class, 'show']);

//gamemodes of a game
Route::get('/game/{id}/gamemode', [GameController::class, 'gamemodes']);

//platforms of a game
Route::get('/game/{id}/platform', [GameController::class, 'platform']);

//----------------Auth routes ---------------
Route::middleware('auth:sanctum')->group(function () {

    // Route::post('/logout', [AuthController::class, 'logout']);

    // //all games name, id and image
    // Route::get('/games', [GameController::class, 'index']);

    // //full game details, including gamemodes and platforms
    // Route::get('/game/{id}', [GameController::class, 'show']);

    // //gamemodes of a game
    // Route::get('/game/{id}/gamemode', [GameController::class, 'gamemodes']);

    // //platforms of a game
    // Route::get('/game/{id}/platform', [GameController::class, 'platform']);

});
