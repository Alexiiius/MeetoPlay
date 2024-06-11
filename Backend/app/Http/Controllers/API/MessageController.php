<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Message;
use App\Models\User;

//private smg
use App\Jobs\SendMessage;
use App\Events\GotMessage;

//public msg
use App\Jobs\SendPublicMessage;
use App\Events\GlobalMessage;

use Illuminate\Support\Facades\Log as Logger;
use Illuminate\Pagination\Paginator;



/**
 * @OA\Tag(
 *     name="Messages",
 *     description="Endpoints for Messages between users"
 * )
 */
class MessageController extends Controller {



    /**
 * @OA\Post(
 *     path="/api/message/send",
 *     tags={"Messages"},
 *     summary="Send a message to a user or to global chat",
 *     operationId="sendMessage",
 *     @OA\RequestBody(
 *         description="Message data",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="to_user_id",
 *                 description="ID of the user to send the message to",
 *                 type="integer"
 *             ),
 *             @OA\Property(
 *                 property="text",
 *                 description="Text of the message",
 *                 type="string"
 *             ),
 *             @OA\Property(
 *                 property="group_name",
 *                 description="Group name to send the message to",
 *                 type="string",
 *                 enum={"global", "private"}
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Message sent successfully",
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
 *                         property="message_id",
 *                         type="integer"
 *                     ),
 *                     @OA\Property(
 *                         property="message_text",
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
    public function sendMessage(Request $request) {

        $request->validate([
            'to_user_id' => 'required',
            'text' => 'required',
            'group_name' => 'in:global,private',
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

        if ($request->get('group_name') == "global"){
            $message = Message::create([
                'from_user_id' => auth()->user()->id,
                'to_user_id' => 1,
                'from_user_avatar' => auth()->user()->avatar,
                'text' => $request->get('text'),
                'from_user_name' => auth()->user()->getFullNameAttribute(),
                'to_user_name' => "Public",
                'time' => now()->format('d-m-Y\TH:i:s. T'),
            ]);

            // Dispatch the SendPublicMessage job who send GlobalMessage event
           SendPublicMessage::dispatch($message);

        }else{
            $message = Message::create([
                'from_user_id' => auth()->user()->id,
                'to_user_id' => $request->get('to_user_id'),
                'text' => $request->get('text'),
                'from_user_name' => auth()->user()->getFullNameAttribute(),
                'to_user_name' => User::find($request->get('to_user_id'))->getFullNameAttribute(),
                'time' => now()->format('d-m-Y\TH:i:s. T'),
            ]);

                // Dispatch the SendMessage job who send GotMessage event
                SendMessage::dispatch($message);

                // Broadcast the GotMessage event
                // event(new GotMessage($message));
        }





        return response()->json([
            'data' => [
                'message' => 'Message sent successfully.',
            ],
        ]);

    }




    /**
 * @OA\Get(
 *     path="/api/message/get/{id}/{page}",
 *     tags={"Messages"},
 *     summary="Get all messages between auth user and id user",
 *     operationId="getMessages",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the user to get messages from",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Messages retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="messages",
 *                     type="array",
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="from_user_id", type="integer"),
 *                         @OA\Property(property="to_user_id", type="integer"),
 *                         @OA\Property(property="text", type="string"),
 *                         @OA\Property(property="created_at", type="string"),
 *                         @OA\Property(property="updated_at", type="string")
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
        ->paginate(20);

        return response()->json([
            'data' => [
                'messages' => $messages,
            ],
        ]);

    }



    /**
 * @OA\Put(
 *     path="/api/message/read",
 *     tags={"Messages"},
 *     summary="Mark all messages from arrayID as read",
 *     operationId="markAsRead",
 *     @OA\RequestBody(
 *         description="Message IDs to mark as read",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="message_ID",
 *                 description="Array of message IDs to mark as read",
 *                 type="array",
 *                 @OA\Items(
 *                     type="integer"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Messages marked as read successfully",
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
 *                     property="messages_count",
 *                     type="integer"
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
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
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




    /**
 * @OA\Get(
 *     path="/api/message/get/unread",
 *     tags={"Messages"},
 *     summary="Get all unread messages from auth user",
 *     operationId="getUnreadMessages",
 *     @OA\Response(
 *         response=200,
 *         description="Unread messages retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="unread_messages",
 *                     type="array",
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="from_user_id", type="integer"),
 *                         @OA\Property(property="to_user_id", type="integer"),
 *                         @OA\Property(property="text", type="string"),
 *                         @OA\Property(property="created_at", type="string"),
 *                         @OA\Property(property="updated_at", type="string"),
 *                         @OA\Property(property="read_at", type="string", nullable=true)
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
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
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



    
    /**
 * @OA\Get(
 *     path="/api/message/get/conversations",
 *     tags={"Messages"},
 *     summary="Get all conversations from auth user with other users",
 *     operationId="getConversations",
 *     @OA\Response(
 *         response=200,
 *         description="Conversations retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(
 *                     property="conversations",
 *                     type="array",
 *                     @OA\Items(
 *                         type="object",
 *                         @OA\Property(property="from_user_id", type="integer"),
 *                         @OA\Property(property="to_user_id", type="integer"),
 *                         @OA\Property(
 *                             property="user",
 *                             type="object",
 *                             @OA\Property(property="id", type="integer"),
 *                             @OA\Property(property="name", type="string"),
 *                             @OA\Property(property="tag", type="string"),
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
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function getConversations() {
        $userId = auth()->user()->id;

        $conversations = Message::select('from_user_id', 'to_user_id')
        ->where('from_user_id', $userId)
        ->where('to_user_id', '<>', 1)
        ->orWhere(function ($query) use ($userId) {
            $query->where('to_user_id', $userId)
                  ->where('from_user_id', '<>', 1);
        })
        ->groupBy('from_user_id', 'to_user_id')
        ->get();

        // who is the user that I am talking to
        foreach ($conversations as $conversation) {
            if ($conversation->from_user_id == $userId) {
                $conversation->user = User::where('id', $conversation->to_user_id)->select('id', 'name', 'tag', 'avatar', 'status')->first();
            } else {
                $conversation->user = User::where('id', $conversation->from_user_id)->select('id', 'name', 'tag', 'avatar', 'status')->first();
            }
        }


        return response()->json([
            'data' => [
                'conversations' => $conversations,
            ],
        ]);
    }

    public function getGlobalMenssage(){
        $messages = Message::where('to_user_id', 1)
                            ->where('to_user_name', 'Public')
                            ->orderBy('created_at', 'desc')
                            ->take(20)
                            ->get();

        return response()->json([
            'data' => [
                'messages' => $messages,
            ],
        ]);
    }


}
