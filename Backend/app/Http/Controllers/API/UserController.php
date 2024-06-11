<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

use App\Models\User;
use App\Rules\SocialsRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


/**
 * @OA\Tag(
 *     name="User Endpoints",
 *     description="Endpoints for authenticated users"
 * )
 */
class UserController extends Controller {

    //return all users id, name and email
    public function index() {
        $users = User::select('id', 'name', 'email', 'tag')->get();
        return $users;
    }

    //save a new user
    public function store(Request $request) {
        //
    }


/**
 * @OA\Get(
 *     path="/api/user",
 *     summary="Return all data from the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Return all data from the authenticated user",
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(property="id", type="integer", example=35),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="email", type="string", example="user3@example.com"),
 *                 @OA\Property(property="email_verified_at", type="string", example=null),
 *                 @OA\Property(property="tag", type="string", example="0035"),
 *                 @OA\Property(property="avatar", type="string", example="http://localhost/storage/avatars/default.jpg"),
 *                 @OA\Property(property="date_of_birth", type="string", example=null),
 *                 @OA\Property(property="status", type="string", example="Offline"),
 *                 @OA\Property(property="is_admin", type="integer", example=0),
 *                 @OA\Property(property="bio", type="string", example="Hello, I am using MeetoPlay!"),
 *                 @OA\Property(property="socials", type="string", example=null),
 *                 @OA\Property(property="email_verification_token", type="string", example="7494e5b87e24fdbd228f086dfcb5dbdeb9281294813757f4c0331fde73dac6d7"),
 *                 @OA\Property(property="created_at", type="string", example="2024-06-11T08:06:15.000000Z"),
 *                 @OA\Property(property="updated_at", type="string", example="2024-06-11T08:06:15.000000Z")
 *             )
 *         )
 *     )
 * )
 */
    //return all data from the authenticated user
    public function user(Request $request) {
        return $request->user();
    }



    //return a user full data by id
    public function showOld(string $id) {
        return $user = User::find($id);
    }


/**
 * @OA\Get(
 *    path="/api/user/{id}",
 *    summary="Return id, name, email, tag, avatar, date_of_birth, bio and socials from a specific user by id",
 *    tags={"User Endpoints"},
 *    security={{"Bearer":{}}},
 *    @OA\Parameter(
 *       name="id",
 *       in="path",
 *       description="ID of user to return",
 *       required=true,
 *       @OA\Schema(type="integer", example=35)
 *    ),
 *    @OA\Response(
 *        response=200,
 *        description="Successful operation",
 *        @OA\JsonContent(
 *           type="object",
 *           @OA\Property(property="id", type="integer", example=35),
 *           @OA\Property(property="name", type="string", example="John Doe"),
 *           @OA\Property(property="tag", type="string", example="0035"),
 *           @OA\Property(property="email", type="string", example="user3@example.com"),
 *           @OA\Property(property="avatar", type="string", example="http://localhost/storage/avatars/default.jpg"),
 *           @OA\Property(property="date_of_birth", type="string", example=null),
 *           @OA\Property(property="bio", type="string", example="Hello, I am using MeetoPlay!"),
 *           @OA\Property(property="socials", type="string", example=null)
 *        )
 *    )
 * )
 */
    //return a user not sensitive data by id
    public function showNew(string $id) {
        $user = User::where('id', $id)
            ->select('id', 'name', 'tag', 'email', 'avatar', 'date_of_birth', 'bio', 'socials')
            ->first();
        return $user;
    }

    //update a user by id and data
    public function update(Request $request, string $id) {
        $user = User::find($id);
        $user->update($request->all());
        $user->save();
        $user->refresh();
        if ($user->wasChanged()) {
            return response()->json(['message' => 'User updated successfully']);
        }else{
            return response()->json(['message' => 'User update failed']);
        }
    }



    /**
 * @OA\Post(
 *     path="/api/user/delete",
 *     summary="Delete the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="Password for verification",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="password", type="string", example="password")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="User deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Password incorrect",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Password incorrect.")
 *         )
 *     )
 * )
 */
    public function destroy(Request $request) {

        $user = auth()->user();

        $request->validate([
            'password' => 'required|string|min:3',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password incorrect.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);


    }


    /**
 * @OA\Get(
 *     path="/api/user/search/{search}",
 *     summary="Search for a user by name or tag",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="search",
 *         in="path",
 *         description="Search term. Use 'name#tag' to search by both name and tag",
 *         required=true,
 *         @OA\Schema(type="string", example="John#0011")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Search results",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="tag", type="string", example="developer"),
 *                 @OA\Property(property="avatar", type="string", example="https://example.com/avatar.jpg")
 *             )
 *         )
 *     )
 * )
 */
    public function search(string $search) {
        $parts = explode('#', $search);

        if (count($parts) == 2) {
            // Buscar por name y tag
            $users = User::where('name', 'like', '%'.$parts[0].'%')
                ->where('tag', 'like', '%'.$parts[1].'%')
                ->select('id', 'name', 'tag', 'avatar')
                ->get();
        } else {
            // Buscar solo por name o tag
            $users = User::where('name', 'like', '%'.$search.'%')
                ->orWhere('tag', 'like', '%'.$search.'%')
                ->select('id', 'name', 'tag', 'avatar')
                ->get();
        }

        return $users;
    }




   /**
 * @OA\Patch(
 *     path="/api/user/status/{status}",
 *     summary="Change the status of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\Parameter(
 *         name="status",
 *         in="path",
 *         description="New status to set",
 *         required=true,
 *         @OA\Schema(type="string", example="online")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Status changed successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="Status changed successfully"),
 *             @OA\Property(property="old_status", type="string", example="offline"),
 *             @OA\Property(property="new_status", type="string", example="online")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Status change failed or already the same status.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="Status change failed or already the same status.")
 *         )
 *     )
 * )
 */
    public function changeStatus(Request $request, string $status) {

        $user = auth()->user();
        $userOldStatus = $user->status;

        try {
            $user->setStatus($status);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }

        if ($user->wasChanged()) {
            return response()->json([
                'message' => 'Status changed successfully',
                'old_status' => $userOldStatus,
                'new_status' => $user->status,
            ]);
        }else{
            return response()->json(['message' => 'Status change failed or already the same status.']);
        }

    }


    /**
 * @OA\Post(
 *     path="/api/user/avatar/update",
 *     summary="Update the avatar of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="New avatar",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 type="object",
 *                 @OA\Property(
 *                     property="avatar",
 *                     description="New avatar image",
 *                     type="string",
 *                     format="binary"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="You have successfully upload image.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="You have successfully upload image."),
 *                 @OA\Property(property="avatar", type="string", example="avatars/userId_avatar.jpg"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/avatar/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Error uploading image.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Error uploading image."),
 *                 @OA\Property(property="error", type="string", example="Error message"),
 *                 @OA\Property(property="avatar", type="string", example="avatars/userId_avatar.jpg"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/avatar/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     )
 * )
 */
    public function updateAvatar(Request $request) {

        try {
            $request->validate([
                'avatar' => 'required|image|max:2048',
            ]);

            $user = auth()->user();

            $avatarName = $user->id.'_avatar.jpg';
            $avatar = $request->file('avatar');

            $image = Image::read($avatar);
            $image->resize(400, 400);
            $image->toPng()->save(storage_path('app/public/avatars/'.$avatarName));
            $user->avatar = 'avatars/'.$avatarName;
            $user->save();

            return response()->json([
                'data' => [
                    'message'=>'You have successfully upload image.',
                    'avatar' => $user->avatar,
                    'Links' => [
                        'self' => url('/api/user/avatar/update'),
                    ],
                ],
                'meta' => [
                    'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => [
                    'message'=>'Error uploading image.',
                    'error' => $e->getMessage(),
                    'avatar' => $user->avatar,
                    'Links' => [
                        'self' => url('/api/user/avatar/update'),
                    ],
                ],
                'meta' => [
                    'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
                ],
            ], 500);
        }

    }




    /**
 * @OA\Patch(
 *     path="/api/user/bio/update",
 *     summary="Update the bio of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="New bio",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="bio", type="string", example="This is my new bio")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Bio updated successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Bio updated successfully"),
 *                 @OA\Property(property="bio", type="string", example="This is my new bio"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/bio/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bio update failed",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Bio update failed.")
 *         )
 *     )
 * )
 */
    public function updateBio(Request $request) {

        $request->validate([
            'bio' => 'required|string|max:150',
        ]);

        $user = auth()->user();
        $user->bio = $request->bio;
        $user->save();
        return response()->json(['data' => [
            'message' => 'Bio updated successfully',
            'bio' => $user->bio,
            'Links' => [
                'self' => url('/api/user/bio/update'),
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ]
        ]]);
    }


    /**
 * @OA\Patch(
 *     path="/api/user/socials/update",
 *     summary="Update the socials of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="New socials",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="socials", type="object", example={"twitter": "myTwitter", "facebook": "myFacebook", "instagram": "myInstagram", "X": "myX", "discord": "myDiscord", "steam": "mySteam", "twitch": "myTwitch", "youtube": "myYoutube"})
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Socials updated successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Socials updated successfully"),
 *                @OA\Property(property="socials", type="object", example={"twitter": "myTwitter", "facebook": "myFacebook", "instagram": "myInstagram", "X": "myX", "discord": "myDiscord", "steam": "mySteam", "twitch": "myTwitch", "youtube": "myYoutube"}),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/socials/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Socials update failed",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Socials update failed.")
 *         )
 *     )
 * )
 */
    public function updateSocials(Request $request) {

        //validate using SocialsRule
        $request->validate([
            'socials' => ['required', new SocialsRule],
        ]);

        $user = auth()->user();

        //parse json to string
        $string = json_encode($request->socials);

        $user->socials = $string;
        $user->save();
        return response()->json(['data' => [
            'message' => 'Socials updated successfully',
            'socials' => $user->socials,
            'Links' => [
                'self' => url('/api/user/socials/update'),
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ]
        ]]);
    }



    /**
 * @OA\Patch(
 *     path="/api/user/password/update",
 *     summary="Update the password of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="Current and new password",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="password", type="string", example="oldPassword"),
 *             @OA\Property(property="new_password", type="string", example="newPassword")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Password updated successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Password updated successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/password/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Password incorrect",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Password incorrect.")
 *         )
 *     )
 * )
 */
    public function updatePassword(Request $request) {

        $request->validate([
            'password' => 'required|string|min:3',
            'new_password' => 'required|string|min:3',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password incorrect.'], 403);
        }

        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json(['data' => [
            'message' => 'Password updated successfully',
            'Links' => [
                'self' => url('/api/user/password/update'),
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ]
        ]]);
    }


    /**
 * @OA\Get(
 *     path="/api/user/send/email-verification",
 *     summary="Resend the email verification of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Email verification sent successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Email verification sent successfully"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/send/email-verification")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Email already verified",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Email already verified.")
 *         )
 *     )
 * )
 */
    public function resendEmailVerification(Request $request) {
        $user = auth()->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['error' => 'Email already verified.'], 403);
        }

        $user->sendEmailVerificationNotification();
        return response()->json(['data' => [
            'message' => 'Email verification sent successfully',
            'Links' => [
                'self' => url('/api/user/send/email-verification'),
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ]
        ]]);
    }





    /**
 * @OA\Patch(
 *     path="/api/user/email/update",
 *     summary="Update the email of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="New email and current password",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="email", type="string", example="newEmail@example.com"),
 *             @OA\Property(property="password", type="string", example="currentPassword")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Email updated successfully, please verify your email. Token deleted.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Email updated successfully, please verify your email. Token deleted."),
 *                 @OA\Property(property="email", type="string", example="newEmail@example.com"),
 *                 @OA\Property(property="token", type="string", example="newToken"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/email/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Password incorrect.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Password incorrect.")
 *         )
 *     )
 * )
 */
    public function updateEmail(Request $request) {

        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:3',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password incorrect.'], 403);
        }

        $user->email = $request->email;
        $user->email_verified_at = null;
        $user->sendEmailVerificationNotification();
        $user->tokens()->delete();
        $user->save();

        $token = $request->user()->createToken('auth_token')->plainTextToken;

        return response()->json(['data' => [
            'message' => 'Email updated successfully, please verify your email. Token deleted.',
            'email' => $user->email,
            'token' => $token,
            'Links' => [
                'self' => url('/api/user/email/update'),
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ]
        ]]);
    }



    /**
 * @OA\Patch(
 *     path="/api/user/name/update",
 *     summary="Update the name of the authenticated user",
 *     tags={"User Endpoints"},
 *     security={{"Bearer":{}}},
 *     @OA\RequestBody(
 *         description="New name and password for verification",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="password", type="string", example="password")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Name updated successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="data", type="object", 
 *                 @OA\Property(property="message", type="string", example="Name updated successfully"),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="Links", type="object", 
 *                     @OA\Property(property="self", type="string", example="/api/user/name/update")
 *                 ),
 *                 @OA\Property(property="meta", type="object", 
 *                     @OA\Property(property="timestamp", type="string", example="01-01-2022T00:00:00. UTC")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Password incorrect",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="error", type="string", example="Password incorrect.")
 *         )
 *     )
 * )
 */
    public function updateName(Request $request) {

        $request->validate([
            'name' => 'required|string|min:3',
            'password' => 'required|string|min:3',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password incorrect.'], 403);
        }

        $user->name = $request->name;
        $user->save();

        return response()->json(['data' => [
            'message' => 'Name updated successfully',
            'name' => $user->name,
            'Links' => [
                'self' => url('/api/user/name/update'),
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ]
        ]]);
    }

}
