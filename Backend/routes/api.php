<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;

//import the controllers
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\FollowerController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Private routes for users
Route::middleware(['auth:sanctum'])->group(function () {

    // ------------------------------------------------------------------ USER ENDPOINTS ------------------------------------------------------------------

    Route::post('/logout', [AuthController::class, 'logout']); //logout the user authenticated
    Route::get('/users', [UserController::class, 'index']); //name, email and id from all users
    Route::get('/user/{id}', [UserController::class, 'show']); //all data from specific user
    Route::get('/user', [UserController::class, 'user']); //return all data from the authenticated user
    
    //WIP
    Route::post('/user/{id}', [UserController::class, 'update']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------ EVENT ENDPOINTS ------------------------------------------------------------------

    Route::post('/create/event', [EventController::class, 'store']); //create a new event and its requirements
    Route::get('/event/{id}', [EventController::class, 'show']); //show a specific event wih its requirements

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    //  ------------------------------------------------------------------ FOLLOW ENDPOINTS ------------------------------------------------------------------

    Route::post('/follow/{id}', [FollowerController::class, 'follow']); //auth user follow id user
    Route::post('/unfollow/{id}', [FollowerController::class, 'unfollow']); //auth user unfollow id user
    Route::get('/followers/{id}', [FollowerController::class, 'followers']); //show all followers from id user
    Route::get('/following/{id}', [FollowerController::class, 'following']); //show all following from id user

    // -----------------------------------------------------------------------------------------------------------------------------------------------------


});

//Private routes for admin
Route::middleware(['auth:sanctum' , 'admin'])->group(function () {

    //

});

//Health check
Route::get('health-check', function () {
    return response()->json([ 'status' => 'OK', 'timestamp' => Carbon::now() ]);
});
