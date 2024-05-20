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
Route::post('/register', [AuthController::class, 'register']); //register a new user using name, email password and password_confirmation
Route::post('/login', [AuthController::class, 'login']); //login a user using email and password return a token to authenticate in the private routes


// Private routes for users
Route::middleware(['auth:sanctum'])->group(function () {

    // ------------------------------------------------------------------ USER ENDPOINTS ------------------------------------------------------------------

    Route::post('/logout', [AuthController::class, 'logout']); //logout the user authenticated
    Route::get('/users', [UserController::class, 'index']); //return name, email and id from all users

    Route::get('/user/{id}', [UserController::class, 'show']); //all data from specific user
    Route::get('/user', [UserController::class, 'user']); //return all data from the authenticated user

    //WIP
    Route::post('/user/{id}', [UserController::class, 'update']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------ EVENT ENDPOINTS ------------------------------------------------------------------

    Route::post('/create/event', [EventController::class, 'store']); //create a new event and its requirements


    Route::get('/event/{id}', [EventController::class, 'show']); //show a specific event with requirements by id only if the user has permission to see it
    Route::get('/events/public/{page}', [EventController::class, 'showPublicEvents']); //show all public events
    Route::get('/events/hidden/{page}', [EventController::class, 'showHiddenEvents']); //show all hidden events of auth user
    Route::get('/events/my/{page}', [EventController::class, 'showMyEvents']); //show all events of auth user
    Route::get('/events/friends/{page}', [EventController::class, 'showFriendsEvents']); //show all events of friends of auth user
    Route::get('/events/following/{page}', [EventController::class, 'showFollowingEvents']); //show all public and followers events of the users that auth user is following
    Route::get('/events/participating/{page}', [EventController::class, 'showParticipatingEvents']); //show all events that auth user is participating

    Route::delete('/event/{id}', [EventController::class, 'destroy']); //delete a specific event by id only if the user has permission to delete it
    Route::put('/event/{id}', [EventController::class, 'update']); //update a specific event by id only if the user has permission to update it

    Route::post('/event/{id}/join', [EventController::class, 'addParticipant']); //join a specific event by id only if the user has permission to join it
    Route::post('/event/{id}/leave', [EventController::class, 'removeParticipant']); //leave a specific event by id only if the user has permission to leave it

    Route::get('/event/{id}/see', [EventController::class, 'test']); //test if user can see a specific event by id


    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    //  ------------------------------------------------------------------ FOLLOW ENDPOINTS ------------------------------------------------------------------

    Route::post('/follow/{id}', [FollowerController::class, 'follow']); //auth user follow id user
    Route::post('/unfollow/{id}', [FollowerController::class, 'unfollow']); //auth user unfollow id user
    Route::get('/followers/{id}', [FollowerController::class, 'followers']); //show all followers from id user
    Route::get('/following/{id}', [FollowerController::class, 'following']); //show all following from id user
    Route::get('/isfollowing/{id}', [FollowerController::class, 'show']); //show if auth user follow id user
    Route::get('/friends/{id}', [FollowerController::class, 'friends']); //show all friends of a id user

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    Route::get('/check-token', function () {
        return response()->json(['message' => 'Token is valid'], 200); //return 200 if the token provided is valid (because dani asked for this shitty endpoint)
    });


});

//Private routes for admin
Route::middleware(['auth:sanctum' , 'admin'])->group(function () {

    //

});

//Health check
Route::get('health-check', function () {
    return response()->json([ 'status' => 'OK', 'timestamp' => Carbon::now() ]);
});

//Pepazo endpoint for fun
Route::get('pepazo', function () {
    return response()->json([ 'pepazo' => 'pepazo' ]);
});


