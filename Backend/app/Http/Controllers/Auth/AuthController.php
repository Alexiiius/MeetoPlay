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

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints of Authentication"
 * )
 */
class AuthController extends Controller{

    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register a new user",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation"},
     *             @OA\Property(property="name", type="string", format="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User registered successfully",
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input",
     *     )
     * )
     */
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


    /**
 * @OA\Post(
 *     path="/api/login",
 *     summary="Login a user and return a new token",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         description="User credentials",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="email", type="string", example="user@example.com"),
 *             @OA\Property(property="password", type="string", example="password")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User logged in. New token created and old tokens deleted.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="message", type="string", example="User logged in. New token created and old tokens deleted."),
 *                 @OA\Property(property="access_token", type="string", example="auth_token"),
 *                 @OA\Property(property="token_type", type="string", example="Bearer"),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(property="self", type="string", example="http://localhost/api/login"),
 *                     @OA\Property(property="register", type="string", example="http://localhost/api/register"),
 *                     @OA\Property(property="logout", type="string", example="http://localhost/api/logout")
 *                 )
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(property="timestamp", type="string", example="2022-01-01T00:00:00.000000Z")
 *             )
 *         )
 *     )
 * )
 */
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


    /**
 * @OA\Post(
 *     path="/api/logout",
 *     summary="Logout the authenticated user and delete all tokens",
 *     tags={"Authentication"},
 *     security={{"Bearer":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="User logged out. All tokens deleted.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="message", type="string", example="User logged out. All tokens deleted."),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(property="self", type="string", example="http://localhost/api/logout"),
 *                     @OA\Property(property="login", type="string", example="http://localhost/api/login"),
 *                     @OA\Property(property="register", type="string", example="http://localhost/api/register")
 *                 )
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(property="timestamp", type="string", example="2022-01-01T00:00:00.000000Z")
 *             )
 *         )
 *     )
 * )
 */
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
