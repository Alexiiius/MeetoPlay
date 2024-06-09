<?php

use Illuminate\Support\Facades\Route;


Route::get('health-check-json', function () {
    return response()->json(['status' => 'OK', 'timestamp' => now()->format('d-m-Y\TH:i:s. T')]);
});

Route::get('health-check', function () {
    return "LARAVEL 11 IS A HELL";
});

Route::get('/', function () {
  return redirect('/login');
});

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/users', function () {
    return view('user-manager');
})->middleware(['auth', 'verified'])->name('users');

Route::get('/events', function () {
  return view('events-manager');
})->middleware(['auth', 'verified'])->name('events');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');

require __DIR__ . '/auth.php';
