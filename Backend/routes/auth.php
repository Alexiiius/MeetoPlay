<?php

use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

Route::middleware('guest')->group(function () {
    Volt::route('register', 'pages.auth.register')
        ->name('register');

    Volt::route('login', 'pages.auth.login')
        ->name('login');

    Volt::route('forgot-password', 'pages.auth.forgot-password')
        ->name('password.request');

    Volt::route('reset-password/{token}', 'pages.auth.reset-password')
        ->name('password.reset');
});

Route::middleware('auth')->group(function () {
    Volt::route('verify-email', 'pages.auth.verify-email')
        ->name('verification.notice');

    // Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
    //     ->middleware(['signed', 'throttle:6,1'])
    //     ->name('verification.verify');

    Volt::route('confirm-password', 'pages.auth.confirm-password')
        ->name('password.confirm');
});

Route::get('/email/verify/{id}/{hash}/{token?}', function ($id, $hash, $token = null) {
    $user = User::find($id);

    if ($user && sha1($user->email) === $hash && $user->email_verification_token === $token) {
        $user->markEmailAsVerified();
        event(new Verified($user));

        //TODO DANI HAZ PLANTILLA PUBLICA PARA ESTO
        return response()->json('Email verified');
    }

    return response()->json('Email verification failed', 400);
})->name('verification.verify');