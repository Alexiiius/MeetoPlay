<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Follower;
use App\Models\User;


/**
 * @OA\Tag(
 *     name="Relationships",
 *     description="Endpoints for Relationships between users"
 * )
 */
class FollowerController extends Controller {



    /**
 * @OA\Post(
 *     path="/api/follow/{id}",
 *     tags={"Relationships"},
 *     summary="Auth user follow other user",
 *     operationId="follow",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to follow",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User followed successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="message",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(
 *                         property="self",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="user followed",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="followers of user followed",
 *                         type="string"
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="meta",
 *                     type="object",
 *                     @OA\Property(
 *                         property="follow_count",
 *                         type="string"
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function follow(Request $request, $id) {
        
        $follower = $request->user();
        $followed = User::find($id);

        if ($follower->id == $id) {
            return $this->jsonResponse(
                'User cannot follow itself.',
                [
                    'self' => url('/api/follow/' . $id),
                ],
                [],
                400
            );
        }

        if ($followed) {
            $follow = Follower::where('user_id', $followed->id)
                ->where('follower_id', $follower->id)
                ->first();

            if ($follow) {
                return $this->jsonResponse(
                    'User already followed.',
                    [
                        'self' => url('/api/follow/' . $followed->id),
                    ],
                    [],
                    400
                );
            } else {
                $follow = new Follower();
                $follow->user_id = $followed->id;
                $follow->follower_id = $follower->id;
                $follow->save();
                return $this->jsonResponse(
                    'User followed successfully',
                    [
                        'self' => url('/api/follow/' . $followed->id),
                        'user followed' => url('/api/user/' . $followed->id),
                        'followers of user followed' => url('/api/followers/' . $followed->id),
                    ],
                    [
                        'follow_count' => 'WIP',
                    ]
                );
            }
        } else {
            return $this->jsonResponse(
                'User not found.',
                [
                    'self' => url('/api/follow/' . $id),
                ],
                [],
                404
            );
        }

    }



    /**
 * @OA\Post(
 *     path="/api/unfollow/{id}",
 *     tags={"Relationships"},
 *     summary="Auth user unfollow other user",
 *     operationId="unfollow",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to unfollow",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User unfollowed successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="message",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(
 *                         property="self",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="user unfollowed",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="followers",
 *                         type="string"
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="meta",
 *                     type="object",
 *                     @OA\Property(
 *                         property="follow_count",
 *                         type="string"
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function unfollow(Request $request, $id) {
            
            $follower = $request->user();
            $followed = User::find($id);
    
            if ($followed) {
                $follow = Follower::where('user_id', $followed->id)
                    ->where('follower_id', $follower->id)
                    ->first();
    
                if ($follow) {
                    $follow->delete();
                    return $this->jsonResponse(
                        'User unfollowed successfully',
                        [
                            'self' => url('/api/unfollow/' . $followed->id),
                            'user unfollowed' => url('/api/user/' . $followed->id),
                            'followers' => url('/api/followers/' . $followed->id),
                        ],
                        [
                            'follow_count' => 'WIP',
                        ]
                    );
                } else {
                    return $this->jsonResponse(
                        'User not followed.',
                        [
                            'self' => url('/api/unfollow/' . $followed->id),
                        ],
                        [],
                        400
                    );
                }
            } else {
                return $this->jsonResponse(
                    'User not found.',
                    [
                        'self' => url('/api/unfollow/' . $id),
                    ],
                    [],
                    404
                );
            }
    
        }
        


    /**
 * @OA\Get(
 *     path="/api/followers/{id}",
 *     tags={"Relationships"},
 *     summary="Show all followers from id user",
 *     operationId="followers",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to get followers",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Followers retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="message",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(
 *                         property="self",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="user",
 *                         type="string"
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="meta",
 *                     type="object",
 *                     @OA\Property(
 *                         property="followers_count",
 *                         type="integer"
 *                     ),
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function followers($id) {
        $user = User::find($id);
        if ($user) {
            return $this->jsonResponse(
                'Followers retrieved successfully! Empty array means no followers found.',
                [
                    'self' => url('/api/followers/' . $user->id),
                    'user' => url('/api/user/' . $user->id),
                ],
                [
                    'followers_count' => $user->followers->count(),
                    'followers' => $user->getFollowersWithTags()
                ]
            );
        } else {
            return $this->jsonResponse(
                'User not found.',
                [
                    'self' => url('/api/followers/' . $id),
                ],
                [],
                404
            );
        }
    }





    /**
 * @OA\Get(
 *     path="/api/following/{id}",
 *     tags={"Relationships"},
 *     summary="Show all user that the id user is following",
 *     operationId="following",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to get following",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Following retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="message",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(
 *                         property="self",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="user",
 *                         type="string"
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="meta",
 *                     type="object",
 *                     @OA\Property(
 *                         property="following_count",
 *                         type="integer"
 *                     ),
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function following($id) {
        $user = User::find($id);
        if ($user) {
            return $this->jsonResponse(
                'Following retrieved successfully! Empty array means no following found.',
                [
                    'self' => url('/api/following/' . $user->id),
                    'user' => url('/api/user/' . $user->id),
                ],
                [
                    'following_count' => $user->following->count(),
                    'following' => $user->getFollowingWithTags()
                ]
            );
        } else {
            return $this->jsonResponse(
                'User not found.',
                [
                    'self' => url('/api/following/' . $id),
                ],
                [],
                404
            );
        }
    }





    /**
 * @OA\Get(
 *     path="/api/isfollowing/{id}",
 *     tags={"Relationships"},
 *     summary="Show if auth user follow id user",
 *     operationId="show",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to check if the current user is following",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Following status retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="message",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(
 *                         property="self",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="user",
 *                         type="string"
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="meta",
 *                     type="object",
 *                     @OA\Property(
 *                         property="boolean",
 *                         type="boolean"
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function show(Request $request, $id) {
        $follower = $request->user();
        $followed = User::find($id);

        if ($followed) {
            $follow = Follower::where('user_id', $followed->id)
                ->where('follower_id', $follower->id)
                ->first();

            if ($follow) {
                return $this->jsonResponse(
                    'User ' .$follower->id . ' is following user ' .$followed->id . '.',
                    [
                        'self' => url('/api/follow/' . $followed->id),
                        'user' => url('/api/user/' . $followed->id),
                    ],
                    ['boolean' => true,],
                    200
                );
            } else {
                return $this->jsonResponse(
                    'User ' .$follower->id . ' is not following user ' .$followed->id . '.',
                    [
                        'self' => url('/api/follow/' . $followed->id),
                        'user' => url('/api/user/' . $followed->id),
                    ],
                    ['boolean' => false,],
                    200
                );
            }
        } else {
            return $this->jsonResponse(
                'User not found.',
                [
                    'self' => url('/api/follow/' . $id),
                ],
                [],
                404
            );
        }
    }





    /**
 * @OA\Get(
 *     path="/api/friends/{id}",
 *     tags={"Relationships"},
 *     summary="Show all friends of a id user",
 *     operationId="friends",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to get friends",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Friends retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="message",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="Links",
 *                     type="object",
 *                     @OA\Property(
 *                         property="self",
 *                         type="string"
 *                     ),
 *                     @OA\Property(
 *                         property="user",
 *                         type="string"
 *                     )
 *                 ),
 *                 @OA\Property(
 *                     property="meta",
 *                     type="object",
 *                     @OA\Property(
 *                         property="friends_count",
 *                         type="integer"
 *                     ),
 *                     @OA\Property(
 *                         property="friends",
 *                         type="array",
 *                         @OA\Items(
 *                             type="object",
 *                             @OA\Property(property="id", type="integer"),
 *                             @OA\Property(property="tag", type="string"),
 *                             @OA\Property(property="name", type="string"),
 *                             @OA\Property(property="full_tag", type="string"),
 *                             @OA\Property(property="avatar", type="string"),
 *                             @OA\Property(property="status", type="string")
 *                         )
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function friends($id) {
        $user = User::find($id);
        if (!$user) {
            return $this->jsonResponse(
                'User not found.',
                ['self' => url('/api/friends/' . $id)],
                [],
                404
            );
        }
    
        $followers = $user->followers()->get();
        $following = $user->following()->get();
        $friends = User::whereHas('followers', function ($query) use ($user) {
            $query->where('follower_id', $user->id);
        })->whereHas('following', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();
    
        $friendsData = $friends->map(function ($friend) {
            return [
                'id' => $friend->id,
                'tag' => $friend->tag,
                'name' => $friend->name,
                'full_tag' => $friend->getFullNameAttribute(),
                'avatar' => $friend->avatar,
                'status' => $friend->status,
            ];
        });
    
        return $this->jsonResponse(
            'Friends retrieved successfully! Empty array means no friends found.',
            [
                'self' => url('/api/friends/' . $user->id),
                'user' => url('/api/user/' . $user->id),
            ],
            [
                'friends_count' => $friends->count(),
                'friends' => $friendsData
            ]
        );
    }



    public function jsonResponse($message, $links, $extraData = [], $status = 200) {
        return response()->json([
            'data' => array_merge([
                'message' => $message,
                'Links' => $links,
            ], $extraData),
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], $status);
    }


    
}
