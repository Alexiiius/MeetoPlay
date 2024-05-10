<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\URL;

class AuthController extends Controller{



    public function register(Request $request)  {

        if ($this->validateCredentials($request)) {
            return $this->validateCredentials($request);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        //generate email verification token
        $tokenEmail = $user->generateEmailVerificationToken();

        //send email verification notification by adding the event of registered user
        //this is needed because we are not using the default kit otherwise it would be sent automatically
        //for a custom url we are editing the notification at appserviceprovider
        event(new Registered($user));

        return response()->json([
            'data' => [
                'message' => 'User created',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'Links' => [
                    'self' => url('/api/register'),
                    'login' => url('/api/login'),
                    'logout' => url('/api/logout'),
                ],
            ],
            'meta' => [
                'timestamp' => now(),
            ],
        ]);
    }

    public function login(Request $request) {


        $validationTry = $this->validateLoginCredentials($request);
        if ($validationTry) {
            return $validationTry;
        }

        $validationTry = $this->verifyCredentials($request);
        if ($validationTry) {
            return $validationTry;
        }

        //destroy user related tokens
        $request->user()->tokens()->delete();
        //create a new token
        $token = $request->user()->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data' => [
                'message' => 'User logged in. New token created and old tokens deleted.',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'Links' => [
                    'self' => url('/api/login'),
                    'register' => url('/api/register'),
                    'logout' => url('/api/logout'),
                ],
            ],
            'meta' => [
                'timestamp' => now(),
            ],
        ]);
    }

    // Destroy all tokens related to the user
    public function logout(Request $request) {

        // $validationTry = $this->validateLoginCredentials($request);
        // if ($validationTry) {
        //     return $validationTry;
        // }

        // $validationTry = $this->verifyCredentials($request);
        // if ($validationTry) {
        //     return $validationTry;
        // }

        //destroy user related tokens
        $request->user()->tokens()->delete();
        return response()->json([
            'data' => [
                'message' => 'User logged out. All tokens deleted.',
                'Links' => [
                    'self' => url('/api/logout'),
                    'login' => url('/api/login'),
                    'register' => url('/api/register'),
                ],
            ],
            'meta' => [
                'timestamp' => now(),
            ],
        ]);
    }

    // ------------------- Private functions ------------------- //

    // Generic error response for invalid form fields
    private function genericError($message, $errors) {
        return response()->json([
            'data' => [
                'message' => $message,
                'errors' => $errors,
                'Links' => [
                    'login' => url('/api/login'),
                    'register' => url('/api/register'),
                    'logout' => url('/api/logout'),
                ],
            ],
            'meta' => [
                'timestamp' => now(),
            ],
        ], 422);
    }

    // for name, email, password and password_confirmation
    private function validateCredentials($request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->genericError('Invalid form fields. Please correct the errors and try again.', $validator->errors());
        }
        return null;
    }

    // for email and password
    private function validateLoginCredentials($request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->genericError('Invalid form fields. Please correct the errors and try again.', $validator->errors());
        }
        return null;
    }

    // Verifica las credenciales del usuario
    private function verifyCredentials(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->genericError('Invalid credentials. Please try again.', null);
        }
        return null;
    }

}
