<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes

Route::post('/register', 'App\Http\Controllers\Auth\AuthController@register');
Route::post('/login', 'App\Http\Controllers\Auth\AuthController@login');
Route::post('/logout', 'App\Http\Controllers\Auth\AuthController@logout');

// Private routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Otras rutas que requieren el middleware 'auth:sanctum'
    Route::get('/another-route', function () {
        // ...
    });
});

