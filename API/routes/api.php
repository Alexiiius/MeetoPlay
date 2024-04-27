<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;


//--------------Public routes----------------

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

//----------------Auth routes ---------------
Route::middleware('auth:sanctum')->group(function () {
    
    //all games
    Route::get('/games', [GameController::class, 'index']);

    //gamemodes of a game
    Route::get('/game/{id}', [GameController::class, 'gamemodes']);

});