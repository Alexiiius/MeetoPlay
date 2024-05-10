<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{
    
    //return all users id, name and email
    public function index() {
        $users = User::select('id', 'name', 'email')->get();
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
    public function show(string $id) {
        return $user = User::find($id);
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
}
