<?php

use Illuminate\Support\Facades\Route;

// ROUTES PUBLIC //
Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');


Route::get('health-check-json', function () {
    return response()->json(['status' => 'OK', 'timestamp' => now()->format('d-m-Y\TH:i:s. T')]);
});

Route::get('health-check', function () {
    return "LARAVEL 11 IS A HELL";
});

Route::get('/', function () {
  return redirect('/login');
})->name('home');

// ADMIN ROUTES //

Route::middleware(['auth', 'verified', 'onlyAdminWeb'])->group(function () {

    Route::view('dashboard', 'dashboard')->name('dashboard');

    Route::get('/users', function () {
        return view('user-manager');
    })->name('users');

    Route::get('/events', function () {
    return view('events-manager');
    })->name('events');

    Route::view('profile', 'profile')->name('profile');

    Route::get('pulse', function () {
        return view('pulse');
    })->name('pulse');

});



require __DIR__ . '/auth.php';
