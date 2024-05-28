<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\GotMessage;
use App\Jobs\SendMessage;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Log as Logger;
use Illuminate\Pagination\Paginator;

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
            'from_user_id' => auth()->user()->id,
            'to_user_id' => $request->get('to_user_id'),
            'text' => $request->get('text'),
            'from_user_name' => auth()->user()->getFullNameAttribute(),
            'to_user_name' => User::find($request->get('to_user_id'))->getFullNameAttribute(),
            'time' => now()->format('d M Y, H:i:s'),
        ]);

        // Dispatch the SendMessage job
        SendMessage::dispatch($message);

        // Broadcast the GotMessage event
        // event(new GotMessage($message));

        

        return response()->json([
            'data' => [
                'message' => 'Message sent successfully.',
            ],
        ]);

    }

    
    
    public function getMessages($id, $page, Request $request) {
    
        if (User::find($id) == null) {
            return response()->json([
                'data' => [
                    'message' => "User with ID $id not found.",
                ],
            ]);
        }
    
        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });
    
        $messages = Message::where(function ($query) use ($id) {
            $query->where('from_user_id', auth()->id())
                  ->where('to_user_id', $id);
        })->orWhere(function ($query) use ($id) {
            $query->where('from_user_id', $id)
                  ->where('to_user_id', auth()->id());
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);
    
        return response()->json([
            'data' => [
                'messages' => $messages,
            ],
        ]);
    
    }

    public function markAsRead(Request $request) {
        $messageIds = $request->get('message_ID');
    
        $messages = Message::whereIn('id', $messageIds)
                           ->where('to_user_id', auth()->user()->id)
                           ->update(['read_at' => now()]);

        return response()->json([
            'data' => [
                'message' => 'Messages marked as read.',
                'messages_count' => $messages,
            ],
        ]);
    }

    public function getUnreadMessages() {

        $userId = auth()->user()->id;

        $unreadMessages = Message::where('to_user_id', $userId)
                                 ->whereNull('read_at')
                                 ->get();
    
        return response()->json([
            'data' => [
                'unread_messages' => $unreadMessages,
            ],
        ]);
    }
    

}