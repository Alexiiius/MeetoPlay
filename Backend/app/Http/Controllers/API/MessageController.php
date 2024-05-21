<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\GotMessage;
use App\Jobs\SendMessage;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller {

    public function sendMessage(Request $request) {

        $request->validate([
            'to_user_id' => 'required',
            'text' => 'required',
        ]);

        $toUserID = $request->get('to_user_id');

        if (User::find($toUserID) == null) {
            return response()->json([
                'success' => false,
                'message' => "User with ID $toUserID not found.",
            ]);
        }

        if ($request->get('to_user_id') == auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => "You cant send a message to yourself.",
            ]);
        }

        $message = Message::create([
            'from_user_id' => auth()->id(),
            'to_user_id' => $request->get('to_user_id'),
            'text' => $request->get('text'),
            'from_user_name' => auth()->user()->getFullNameAttribute(),
            'to_user_name' => User::find($request->get('to_user_id'))->getFullNameAttribute(),
            'time' => now()->format('d M Y, H:i:s'),
        ]);

        // Dispatch the SendMessage job
        // SendMessage::dispatch($message);

        // Broadcast the GotMessage event
        event(new GotMessage($message));

        

        return response()->json([
            'success' => true,
            'message' => "Message created and job dispatched.",
        ]);

    }

    public function getMessages($id, Request $request) {

        if (User::find($id) == null) {
            return response()->json([
                'success' => false,
                'message' => "User with ID $id not found.",
            ]);
        }

        $messages = Message::where('from_user_id', auth()->id())
            ->where('to_user_id', $id)
            ->orWhere('from_user_id', $id)
            ->where('to_user_id', auth()->id())
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);

    }

}