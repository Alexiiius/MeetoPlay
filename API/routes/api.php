<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/gamess', [GameController::class, 'index']);

//ruta apra recuperar todos los juegos
Route::middleware('auth:sanctum')->get('/games', [GameController::class, 'index']);

//Auth middleware group
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{id}', [GameController::class, 'show']);
    Route::post('/games', [GameController::class, 'store']);
    Route::put('/games/{id}', [GameController::class, 'update']);
    Route::delete('/games/{id}', [GameController::class, 'destroy']);

    //Return null if the user is not authenticated or the user data if it is
    //Route to verify if the user is authenticated
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
});