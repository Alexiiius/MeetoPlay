<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;

// Public routes

Route::post('/register', 'App\Http\Controllers\Auth\AuthController@register');
Route::post('/login', 'App\Http\Controllers\Auth\AuthController@login');
Route::post('/logout', 'App\Http\Controllers\Auth\AuthController@logout');

// Private routes
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/user/{id}', 'App\Http\Controllers\UserController@show');


});

Route::get('health-check', function () {
    return response()->json([ 'status' => 'OK', 'timestamp' => Carbon::now() ]);
});
