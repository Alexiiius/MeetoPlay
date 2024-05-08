<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;

//import the controllers
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\EventController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Private routes for users
Route::middleware(['auth:sanctum'])->group(function () {

    //all data from specific user
    Route::get('/user/{id}', [UserController::class, 'show']);
    //return all data from the authenticated user
    Route::get('/user', [UserController::class, 'user']);
    //name, email and id from all users
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/user/{id}', [UserController::class, 'update']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);

    //create a new event and its requirements
    Route::post('/create/event', [EventController::class, 'store']);
    //show a specific event wih its requirements
    Route::get('/event/{id}', [EventController::class, 'show']);

});

//Private routes for admin
Route::middleware(['auth:sanctum' , 'admin'])->group(function () {

    //

});

//Health check
Route::get('health-check', function () {
    return response()->json([ 'status' => 'OK', 'timestamp' => Carbon::now() ]);
});
