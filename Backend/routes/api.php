<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;

//import the controllers
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\FollowerController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\GameUserStatsController;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\API\AdvisesController;

// Public routes
Route::post('/register', [AuthController::class, 'register']); //register a new user using name, email password and password_confirmation
Route::post('/login', [AuthController::class, 'login']); //login a user using email and password return a token to authenticate in the private routes


// Private routes for users
Route::middleware(['auth:sanctum'])->group(function () {

    // ------------------------------------------------------------------ USER ENDPOINTS ------------------------------------------------------------------

    Route::post('/logout', [AuthController::class, 'logout']); //logout the user authenticated

    Route::get('/user/{id}', [UserController::class, 'showNew']); //return id, name, email, tag, avatar, date_of_birth, bio and socials from a specific user by id
    Route::get('/user', [UserController::class, 'user']); //return all data from the authenticated user
    Route::patch('user/status/{status}', [UserController::class, 'changeStatus']); //update the status of the authenticated user (online, offline, away, busy, invisible)

    Route::get('/user/search/{search}', [UserController::class, 'search'])->where('search', '.*'); //search users by name, tag and name#tag

    //WIP
    Route::post('/user/delete', [UserController::class, 'destroy']);

    Route::patch('/user/name/update', [UserController::class, 'updateName']); // update the name of the authenticated user
    Route::patch('/user/password/update', [UserController::class, 'updatePassword']); //update the password of the authenticated user
    Route::patch('/user/bio/update', [UserController::class, 'updateBio']); //update the bio of the authenticated user
    Route::patch('/user/socials/update', [UserController::class, 'updateSocials']); //update the socials of the authenticated user
    Route::get('/user/send/email-verification', [UserController::class, 'resendEmailVerification']); //send an email verification to the authenticated user
    Route::patch('/user/email/update', [UserController::class, 'updateEmail']); //update the authenticated user email

    Route::post('/user/avatar/update', [UserController::class, 'updateAvatar']); //update the avatar of the authenticated user

    //User Game and Gamemodes Stats
    Route::post('/user/game-stats/create', [GameUserStatsController::class, 'store']); //create a new game stats and associate it with a user
    Route::get('/user/game-stats/search/{id}', [GameUserStatsController::class, 'index']); //return all game stats and gamemodes associated stats from a specific user id
    Route::delete('/user/game-stats/delete/{gameStatID}', [GameUserStatsController::class, 'destroy']); //delete a specific game stats by game_id only if the user has permission to delete it
    Route::put('/user/game-stats/update/{gameStatID}', [GameUserStatsController::class, 'update']); //update a specific game stats by game_id only if the user has permission to update it


    Route::patch('/user/game-stats/gamemode/update/{gamemodeStatID}', [GameUserStatsController::class, 'gamemodeUpdate']); //update a specific gamemode stats by gamemode_id only if the user has permission to update it
    Route::delete('/user/game-stats/gamemode/delete/{gamemodeStatID}', [GameUserStatsController::class, 'gamemodeDestroy']); //delete a specific gamemode stats by gamemode_id only if the user has permission to delete it
    Route::post('/user/game-stats/gamemode/create', [GameUserStatsController::class, 'gamemodeCreate']); //create a new gamemode stats and associate it with a game stats

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------ EVENT ENDPOINTS ------------------------------------------------------------------

    Route::post('/event/create', [EventController::class, 'store']); //create a new event and its requirements
    Route::delete('/event/delete/{id}', [EventController::class, 'destroy']); //delete a specific event by id only if the user has permission to delete it
    Route::put('/event/update/{id}', [EventController::class, 'updateEvent']); //update a specific event by id only if the user has permission to update it


    Route::get('/event/{id}', [EventController::class, 'show']); //show a specific event with requirements by id only if the user has permission to see it
    Route::get('/events/public/{page}', [EventController::class, 'showPublicEvents']); //show all public events
    Route::get('/events/hidden/{page}', [EventController::class, 'showHiddenEvents']); //show all hidden events of auth user
    Route::get('/events/my/{page}', [EventController::class, 'showMyEvents']); //show all events of auth user
    Route::get('/events/friends/{page}', [EventController::class, 'showFriendsEvents']); //show all events of friends of auth user
    Route::get('/events/following/{page}', [EventController::class, 'showFollowingEvents']); //show all public and followers events of the users that auth user is following
    Route::get('/events/participating/{page}', [EventController::class, 'showParticipatingEvents']); //show all events that auth user is participating

    Route::post('/event/{id}/join', [EventController::class, 'addParticipant']); //join a specific event by id only if the user has permission to join it
    Route::post('/event/{id}/leave', [EventController::class, 'removeParticipant']); //leave a specific event by id only if the user has permission to leave it

    Route::get('/events/search/{search}/{group}/{page}', [EventController::class, 'searchNEW']); //search events by title, game name, game mode, platform, date time begin, date time end, date time inscription begin, date time inscription end, max participants, privacy, event owner id, event requirement id

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    //  ------------------------------------------------------------------ FOLLOW ENDPOINTS ------------------------------------------------------------------

    Route::post('/follow/{id}', [FollowerController::class, 'follow']); //auth user follow id user
    Route::post('/unfollow/{id}', [FollowerController::class, 'unfollow']); //auth user unfollow id user
    Route::get('/followers/{id}', [FollowerController::class, 'followers']); //show all followers from id user
    Route::get('/following/{id}', [FollowerController::class, 'following']); //show all following from id user
    Route::get('/isfollowing/{id}', [FollowerController::class, 'show']); //show if auth user follow id user
    Route::get('/friends/{id}', [FollowerController::class, 'friends']); //show all friends of a id user

    // -----------------------------------------------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------- CHATS ENDPOINTS ------------------------------------------------------------------

    Route::post('/message/send', [MessageController::class, 'sendMessage']); //send a message to a user
    Route::get('/message/get/{id}/{page}', [MessageController::class, 'getMessages']); //get all messages between auth user and id user
    Route::get('message/get/unread', [MessageController::class, 'getUnreadMessages']); //get all unread messages from auth user
    Route::put('/message/read', [MessageController::class, 'markAsRead']); //mark all messages from arrayID as read

    Route::get('/message/get/conversations', [MessageController::class, 'getConversations']); //get all conversations from auth user

    // ------------------------------------------------------------------ ADVISES ------------------------------------------------------------

    Route::get('/advises/get', [AdvisesController::class, 'getActualAdvises']); //return all advises that are active

    // -----------------------------------------------------------------------------------------------------------------------------------------------------

    Route::get('/check-token', function () {
        return response()->json(['message' => 'Token is valid'], 200); //return 200 if the token provided is valid (because dani asked for this shitty endpoint)
    });


});

//Private routes for admin
Route::middleware(['auth:sanctum' , 'admin'])->group(function () {

    Route::get('/users', [UserController::class, 'index']); //return name, email and id from all users

    Route::post('/advises/create', [AdvisesController::class, 'createAdvise']); //create a new advise only for admin

});

//Health check
Route::get('health-check', function () {
    return response()->json([ 'status' => 'OK', 'timestamp' => Carbon::now() ]);
});

//Pepazo endpoint for fun
Route::get('/pepazo', function () {
    return response()->json(['pepazo' => 'pepazo']);
});

Route::middleware('auth:sanctum')->post('/broadcasting/auth', function (Request $request) {
    return Broadcast::auth($request);
});
