<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Follower;
use App\Models\User;

class FollowerController extends Controller {

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
                'profile_pic' => $friend->avatar,
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
                'timestamp' => now(),
            ],
        ], $status);
    }


    
}
