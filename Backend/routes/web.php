<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;

Route::get('health-check-json', function () {
    return response()->json([ 'status' => 'OK', 'timestamp' => now()->format('d-m-Y\TH:i:s. T') ]);
});

Route::get('health-check', function () {
    return "LARAVEL 11 IS A HELL";
});

// Route::view('/', 'welcome');

// Route::view('dashboard', 'dashboard')
//     ->middleware(['auth', 'verified'])
//     ->name('dashboard');

// Route::view('profile', 'profile')
//     ->middleware(['auth'])
//     ->name('profile');

require __DIR__.'/auth.php';
