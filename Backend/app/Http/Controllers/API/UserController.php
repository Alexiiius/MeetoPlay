<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

use App\Models\User;

class UserController extends Controller
{
    
    //return all users id, name and email
    public function index() {
        $users = User::select('id', 'name', 'email', 'tag')->get();
        return $users;
    }

    //save a new user
    public function store(Request $request) {
        //
    }

    //return all data from the authenticated user
    public function user(Request $request) {
        return $request->user();
    }

    //return a user full data by id
    public function showOld(string $id) {
        return $user = User::find($id);
    }

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

    //delete a user by id
    public function destroy(string $id) {
        $user = User::find($id);
        $user->delete();
        if ($user->trashed()) {
            return response()->json(['message' => 'User deleted successfully']);
        }else{
            return response()->json(['message' => 'User deletion failed']);
        }
    }


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
                    'timestamp' => now(),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'data' => [
                    'message'=>'Error uploading image.',
                    'avatar' => $user->avatar,
                    'Links' => [
                        'self' => url('/api/user/avatar/update'),
                    ],
                ],
                'meta' => [
                    'timestamp' => now(),
                ],
            ], 500);
        }
            
    }

}
