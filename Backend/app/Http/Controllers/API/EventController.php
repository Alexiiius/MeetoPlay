<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


use App\Models\EventRequirement;
use App\Models\User;
use App\Models\Event;


/**
 * @OA\Tag(
 *     name="Events",
 *     description="Endpoints for Events"
 * )
 */
class EventController extends Controller
{



 /**
 * @OA\Post(
 *     path="/api/event/create",
 *     tags={"Events"},
 *     summary="Create a new event",
 *     security={{"Bearer":{}}},
 *     operationId="createEvent",
 *     @OA\RequestBody(
 *         description="Event data to be created",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 type="object",
 *                 @OA\Property(
 *                     property="data",
 *                     type="object",
 *                     @OA\Property(
 *                         property="event",
 *                         type="object",
 *                         @OA\Property(
 *                             property="event_title",
 *                             type="string",
 *                             description="Title of the event"
 *                         ),
 *                         @OA\Property(
 *                             property="game_id",
 *                             type="integer",
 *                             description="ID of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="game_name",
 *                             type="string",
 *                             description="Name of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="game_mode",
 *                             type="string",
 *                             description="Mode of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="game_pic",
 *                             type="string",
 *                             description="Picture URL of the game",
 *                             example="https://www.example.com/image.jpg"
 *                         ),
 *                         @OA\Property(
 *                             property="platform",
 *                             type="string",
 *                             description="Platform of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="event_owner_id",
 *                             type="integer",
 *                             description="ID of the event owner"
 *                         ),
 *                         @OA\Property(
 *                             property="date_time_begin",
 *                             type="string",
 *                             format="date-time",
 *                             description="Start date and time of the event",
 *                             example="2025-12-31 23:59:59"
 *                         ),
 *                         @OA\Property(
 *                             property="date_time_end",
 *                             type="string",
 *                             format="date-time",
 *                             description="End date and time of the event",
 *                             example="2024-12-31 23:59:59"
 *                         ),
 *                         @OA\Property(
 *                             property="max_participants",
 *                             type="integer",
 *                             description="Maximum number of participants"
 *                         ),
 *                         @OA\Property(
 *                             property="privacy",
 *                             type="public",
 *                             description="Privacy setting of the event",
 *                             enum={"hidden", "friends", "public", "followers"}
 *                         )
 *                     ),
 *                     @OA\Property(
 *                         property="event_requirements",
 *                         type="object",
 *                         @OA\Property(
 *                             property="max_rank",
 *                             type="string",
 *                             description="Maximum rank for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="min_rank",
 *                             type="string",
 *                             description="Minimum rank for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="max_level",
 *                             type="integer",
 *                             description="Maximum level for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="min_level",
 *                             type="integer",
 *                             description="Minimum level for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="max_hours_played",
 *                             type="integer",
 *                             description="Maximum hours played for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="min_hours_played",
 *                             type="integer",
 *                             description="Minimum hours played for the event"
 *                         )
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Event created successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad request"
 *     )
 * )
 */
    public function store(Request $request) {
        $request->validate([
            'data.event.event_title' => 'required|string',
            'data.event.game_id' => 'required|integer',
            'data.event.game_name' => 'required|string',
            'data.event.game_mode' => 'required|string',
            'data.event.game_pic' => 'required|url',
            'data.event.platform' => 'required|string',
            'data.event.event_owner_id' => 'required|integer',
            'data.event.date_time_begin' => 'required|date',
            'data.event.date_time_end' => 'required|date',
            'data.event.date_time_inscription_begin' => 'nullable|date',
            'data.event.date_time_inscription_end' => 'nullable|date',
            'data.event.max_participants' => 'required|integer',
            'data.event.privacy' => 'required|string|in:hidden,friends,public,followers',
            'data.event_requirements.max_rank' => 'nullable|string',
            'data.event_requirements.min_rank' => 'nullable|string',
            'data.event_requirements.max_level' => 'nullable|integer',
            'data.event_requirements.min_level' => 'nullable|integer',
            'data.event_requirements.max_hours_played' => 'nullable|integer',
            'data.event_requirements.min_hours_played' => 'nullable|integer',
        ]);

        $data = $request->input('data');
        $data['event']['event_owner_id'] = $request->user()->id;
        $request->merge(['data' => $data]);

        $event_requirements = EventRequirement::create($request->input('data.event_requirements'));
        $event = Event::create($request->input('data.event'));
        $event->event_requirements()->associate($event_requirements);
        $event->owner()->associate(User::find($request->input('data.event.event_owner_id')));
        $event->save();
        $event_requirements->event()->associate($event);
        $event_requirements->save();

        return response()->json([
            'data' => [
                'message' => 'Event created successfully!',
                'Links' => [
                    'self' => url('/api/create/event'),
                    'event' => url('/api/event/' . $event->id),
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], 201);
    }


    /**
 * @OA\Get(
 *     path="/api/event/{id}",
 *     tags={"Events"},
 *     summary="Show a specific event if the user has permission to see it",
 *     operationId="showEvent",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the event to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Event retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Event not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function show($id) {

        $event = Event::with('event_requirements')
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->find($id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        $user = auth()->user();

        if ($event->privacy == 'hidden' && $event->event_owner_id != $user->id && $user->is_admin != true) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($event->privacy == 'friends') {
            $friends = $user->friends()->toArray();
            if (!in_array($event->event_owner_id, $friends) && $event->event_owner_id != $user->id && $user->is_admin != true) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }

        return response()->json([
            'data' => [
                'event' => $event,
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }




    /**
 * @OA\Get(
 *     path="/api/events/public/{page}",
 *     tags={"Events"},
 *     summary="Show all public events if the user has permission to see it",
 *     operationId="showPublicEvents",
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Public events retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function showPublicEvents($page)
    {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $events = Event::with('event_requirements')
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->where('privacy', 'public')
            ->orderBy('date_time_begin', 'asc')
            ->skip($skip)
            ->take($perPage)
            ->get();
        $total = Event::where('privacy', 'public')->count();

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }



    /**
 * @OA\Get(
 *     path="/api/events/hidden/{page}",
 *     tags={"Events"},
 *     summary="Show all hidden events of auth user if the user has permission to see it. Paginated.",
 *     operationId="showHiddenEvents",
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Hidden events retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function showHiddenEvents($page)
    {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $userId = auth()->id();
        $events = Event::with('event_requirements')
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->where('privacy', 'hidden')
            ->where('event_owner_id', $userId)
            ->orderBy('date_time_begin', 'asc')
            ->skip($skip)
            ->take($perPage)
            ->get();
        $total = Event::where('privacy', 'hidden')
            ->where('event_owner_id', $userId)
            ->count();

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }


    /**
 * @OA\Get(
 *     path="/api/events/my/{page}",
 *     tags={"Events"},
 *     summary="Show all events of auth user if the user has permission to see it. Paginated.",
 *     operationId="showMyEvents",
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User's events retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function showMyEvents($page)
    {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $userId = auth()->id();
        $events = Event::with('event_requirements')
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->where('event_owner_id', $userId)
            ->orderBy('created_at', 'desc')
            ->skip($skip)
            ->take($perPage)
            ->get();
        $total = Event::where('event_owner_id', $userId)->count();

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }




    /**
 * @OA\Get(
 *     path="/api/events/friends/{page}",
 *     tags={"Events"},
 *     summary="Show all events of friends of auth user if the user has permission to see it. Paginated.",
 *     operationId="showFriendsEvents",
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Friends' events retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function showFriendsEvents($page)
    {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $userId = auth()->id();
        $friends = User::find($userId)->friends();
        $events = Event::whereIn('event_owner_id', $friends)
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->where('privacy', '!=', 'hidden')
            ->with('event_requirements')
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->orderBy('date_time_begin', 'asc')
            ->skip($skip)
            ->take($perPage)
            ->get();
        $total = Event::whereIn('event_owner_id', $friends)
            ->where('privacy', '!=', 'hidden')
            ->count();

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }




    /**
 * @OA\Get(
 *     path="/api/events/following/{page}",
 *     tags={"Events"},
 *     summary="Show all public and followers events of the users that auth user is following if the user has permission to see it. Paginated.",
 *     operationId="showFollowingEvents",
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Following users' events retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function showFollowingEvents(Request $request)
    {
        $perPage = 10;
        $skip = ($request->page - 1) * $perPage;
        $userId = auth()->id();
        $following = User::find($userId)->following()->pluck('users.id');
        $events = Event::whereIn('event_owner_id', $following)
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->whereIn('privacy', ['public', 'followers'])
            ->with('event_requirements')
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->orderBy('date_time_begin', 'asc')
            ->skip($skip)
            ->take($perPage)
            ->get();
        $total = Event::whereIn('event_owner_id', $following)
            ->whereIn('privacy', ['public', 'followers'])
            ->count();

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $request->page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }




    /**
 * @OA\Get(
 *     path="/api/events/participating/{page}",
 *     tags={"Events"},
 *     summary="Show all events in which the auth user is participating. Paginated.",
 *     operationId="showParticipatingEvents",
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Participating events retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    //eventos en los que participo
    public function showParticipatingEvents(Request $request)
    {
        $perPage = 10;
        $skip = ($request->page - 1) * $perPage;
        $userId = auth()->id();
        $events = User::find($userId)->events()
            ->with('event_requirements')
            ->with(['owner' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            }])
            ->orderBy('date_time_begin', 'asc')
            ->skip($skip)
            ->take($perPage)
            ->get();
        $total = User::find($userId)->events()->count();

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $request->page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }


 /**
 * @OA\Put(
 *     path="/api/event/update/{id}",
 *     tags={"Events"},
 *     summary="Create a new event",
 *     security={{"Bearer":{}}},
 *     operationId="updateEvent",
 *  *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of event to update",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\RequestBody(
 *         description="Event data to be created",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 type="object",
 *                 @OA\Property(
 *                     property="data",
 *                     type="object",
 *                     @OA\Property(
 *                         property="event",
 *                         type="object",
 *                         @OA\Property(
 *                             property="event_title",
 *                             type="string",
 *                             description="Title of the event"
 *                         ),
 *                         @OA\Property(
 *                             property="game_id",
 *                             type="integer",
 *                             description="ID of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="game_name",
 *                             type="string",
 *                             description="Name of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="game_mode",
 *                             type="string",
 *                             description="Mode of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="game_pic",
 *                             type="string",
 *                             description="Picture URL of the game",
 *                             example="https://www.example.com/image.jpg"
 *                         ),
 *                         @OA\Property(
 *                             property="platform",
 *                             type="string",
 *                             description="Platform of the game"
 *                         ),
 *                         @OA\Property(
 *                             property="event_owner_id",
 *                             type="integer",
 *                             description="ID of the event owner"
 *                         ),
 *                         @OA\Property(
 *                             property="date_time_begin",
 *                             type="string",
 *                             format="date-time",
 *                             description="Start date and time of the event",
 *                             example="2025-12-31 23:59:59"
 *                         ),
 *                         @OA\Property(
 *                             property="date_time_end",
 *                             type="string",
 *                             format="date-time",
 *                             description="End date and time of the event",
 *                             example="2024-12-31 23:59:59"
 *                         ),
 *                         @OA\Property(
 *                             property="max_participants",
 *                             type="integer",
 *                             description="Maximum number of participants"
 *                         ),
 *                         @OA\Property(
 *                             property="privacy",
 *                             type="public",
 *                             description="Privacy setting of the event",
 *                             enum={"hidden", "friends", "public", "followers"}
 *                         )
 *                     ),
 *                     @OA\Property(
 *                         property="event_requirements",
 *                         type="object",
 *                         @OA\Property(
 *                             property="max_rank",
 *                             type="string",
 *                             description="Maximum rank for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="min_rank",
 *                             type="string",
 *                             description="Minimum rank for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="max_level",
 *                             type="integer",
 *                             description="Maximum level for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="min_level",
 *                             type="integer",
 *                             description="Minimum level for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="max_hours_played",
 *                             type="integer",
 *                             description="Maximum hours played for the event"
 *                         ),
 *                         @OA\Property(
 *                             property="min_hours_played",
 *                             type="integer",
 *                             description="Minimum hours played for the event"
 *                         )
 *                     )
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Event created successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad request"
 *     )
 * )
 */
    public function updateEvent($id, Request $request) {
        $event = Event::find($request->id);
        $user = auth()->user();

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        if ($event->event_owner_id != $user->id && $user->is_admin != true) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'data.event.event_title' => 'required|string',
            'data.event.game_id' => 'required|integer',
            'data.event.game_name' => 'required|string',
            'data.event.game_mode' => 'required|string',
            'data.event.game_pic' => 'required|url',
            'data.event.platform' => 'required|string',
            'data.event.event_owner_id' => 'required|integer',
            'data.event.date_time_begin' => 'required|date',
            'data.event.date_time_end' => 'required|date',
            'data.event.date_time_inscription_begin' => 'nullable|date',
            'data.event.date_time_inscription_end' => 'nullable|date',
            'data.event.max_participants' => 'required|integer',
            'data.event.privacy' => 'required|string|in:hidden,friends,public,followers',
            'data.event_requirements.max_rank' => 'nullable|string',
            'data.event_requirements.min_rank' => 'nullable|string',
            'data.event_requirements.max_level' => 'nullable|integer',
            'data.event_requirements.min_level' => 'nullable|integer',
            'data.event_requirements.max_hours_played' => 'nullable|integer',
            'data.event_requirements.min_hours_played' => 'nullable|integer',
        ]);

        $data = $request->input('data');

        //if admin is updating the event, the owner keeps the same
        if ($user->is_admin == true) {
            $data['event']['event_owner_id'] = $request->input('data.event.event_owner_id');
        } else {
            $data['event']['event_owner_id'] = $user->id;
        }
        $request->merge(['data' => $data]);

        // Update the event
        $event->update($request->input('data.event'));
        $requirement = $event->event_requirements;
        $requirement->update($request->input('data.event_requirements'));

        $event->save();
        $requirement->save();

        return response()->json([
            'data' => [
                'message' => 'Event updated successfully!',
                'Links' => [
                    'self' => url('/api/event/' . $event->id),
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], 200);
    }



    /**
 * @OA\Delete(
 *     path="/api/event/delete/{id}",
 *     tags={"Events"},
 *     summary="Delete an event",
 *     security={{"Bearer":{}}},
 *     description="Delete an event by its id",
 *     operationId="destroy",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of event to delete",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Event deleted successfully"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Event not found"
 *     ),
 * )
 */
    public function destroy(Request $request)
    {

        $event = Event::find($request->id);
        $user = auth()->user();

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        if ($event->event_owner_id != $user->id && $user->is_admin != true) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $event->delete();
        return response()->json([
            'data' => [
                'message' => 'Event deleted successfully!',
                'Links' => [
                    'self' => url('/api/event/' . $event->id),
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], 200);
    }


    /**
 * @OA\Post(
 *     path="/api/event/{id}/join",
 *     tags={"Events"},
 *     summary="Add auth user as participant to an event",
 *     operationId="addParticipant",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the event to join",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Participant added successfully",
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
 *                         property="event",
 *                         type="string"
 *                     )
 *                 )
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
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
 *         description="Event not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function addParticipant(Request $request) {

        $event = Event::find($request->id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        if (!$this->canUserSeeThisEvent($event, auth()->user())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $event->insertParticipant(auth()->id());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json([
            'data' => [
                'message' => 'Participant added successfully!',
                'Links' => [
                    'self' => url('/api/event/join/' . $event->id),
                    'event' => url('/api/event/' . $event->id),
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], 200);
    }



    /**
 * @OA\Post(
 *     path="/api/event/{id}/leave",
 *     tags={"Events"},
 *     summary="Remove auth user as participant from an event",
 *     operationId="removeParticipant",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         description="ID of the event to leave",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Participant removed successfully",
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
 *                         property="event",
 *                         type="string"
 *                     )
 *                 )
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
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
 *         description="Event not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function removeParticipant(Request $request)
    {

        $event = Event::find($request->id);

        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        if (!$this->canUserSeeThisEvent($event, auth()->user())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $event->removeParticipant(auth()->id());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json([
            'data' => [
                'message' => 'Participant removed successfully!',
                'Links' => [
                    'self' => url('/api/event/leave/' . $event->id),
                    'event' => url('/api/event/' . $event->id),
                ],
            ],
            'meta' => [
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ], 200);
    }


    public function canUserSeeThisEvent(Event $event, User $user)
    {

        if ($event->privacy == 'hidden' && $event->event_owner_id != $user->id && $user->is_admin != true) {
            return false;
        }

        if ($event->privacy == 'followers') {
            $following = $user->followingArray()->toArray();
            if (!in_array($event->event_owner_id, $following) && $event->event_owner_id != $user->id && $user->is_admin != true) {
                return false;
            }
        }

        if ($event->privacy == 'friends') {
            $friends = $user->friends()->toArray();
            if (!in_array($event->event_owner_id, $friends) && $event->event_owner_id != $user->id && $user->is_admin != true) {
                return false;
            }
        }

        return true;
    }


    public function searchOLD($search, Request $request) {
        $query = $request->search;

        if (empty($query) || $query == null ) {
            return response()->json(['error' => 'No search query'], 400);
        }

        $perPage = 10;
        $skip = ($request->page - 1) * $perPage;

        $events = Event::where('event_title', 'like', "%{$query}%")
            ->orWhereHas('owner', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->orWhere('platform', 'like', "%{$query}%")
            ->orWhere('game_name', 'like', "%{$query}%")
            ->orWhere('game_mode', 'like', "%{$query}%")
            ->skip($skip)
            ->take($perPage)
            ->get();

        $total = $events->count();

        if ($events->isEmpty()) {
            return response()->json(['message' => 'No events found'], 200);
        }

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $request->page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }




    /**
 * @OA\Get(
 *     path="/api/events/search/{search}/{group}/{page}",
 *     tags={"Events"},
 *     summary="Search for events by title, owner name, platform, game name or game mode. Paginated.",
 *     operationId="searchNEW",
 *     @OA\Parameter(
 *         name="search",
 *         in="path",
 *         description="Search query",
 *         required=true,
 *         @OA\Schema(
 *             type="string"
 *         )
 *     ),
 *     @OA\Parameter(
 *         name="group",
 *         in="path",
 *         description="Group to search in ('followed' or 'friends')",
 *         required=true,
 *         @OA\Schema(
 *             type="string"
 *         )
 *     ),
 *     @OA\Parameter(
 *         name="page",
 *         in="path",
 *         description="Page number to retrieve",
 *         required=true,
 *         @OA\Schema(
 *             type="integer"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Search results retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *             ),
 *             @OA\Property(
 *                 property="meta",
 *                 type="object",
 *                 @OA\Property(
 *                     property="current_page",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_pages",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="total_events",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="timestamp",
 *                     type="string",
 *                     format="date-time"
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
 *         description="Page not found"
 *     ),
 *     security={
 *         {"Bearer": {}}
 *     }
 * )
 */
    public function searchNEW($search, $group, Request $request) {
        $query = $request->search;

        if (empty($query) || $query == null ) {
            return response()->json(['error' => 'No search query'], 400);
        }

        $userId = auth()->id();
        $idToSearch = null;

        if ($group == 'followed'){
            $idToSearch = User::find($userId)->following()->pluck('users.id');
        } else if ($group == 'friends'){
            $idToSearch = User::find($userId)->friends();
        }

        $perPage = 10;
        $skip = ($request->page - 1) * $perPage;

        $events = Event::when($idToSearch, function ($query, $idToSearch) {
            return $query->whereIn('event_owner_id', $idToSearch);
        })
        ->where('event_owner_id', '!=', $userId)
        ->where(function ($query) use ($search) {
            $query->where('event_title', 'like', "%{$search}%")
                ->orWhereHas('owner', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhere('platform', 'like', "%{$search}%")
                ->orWhere('game_name', 'like', "%{$search}%")
                ->orWhere('game_mode', 'like', "%{$search}%");
        })
        ->with(['owner' => function ($query) {
            $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
        }])
        ->with('event_requirements')
        ->with(['participants' => function ($query) {
            $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
        }])
        ->skip($skip)
        ->take($perPage)
        ->get();

        // Get the current authenticated user
        $user = auth()->user();

        // Filter the events

        $events = $events->filter(function ($event) use ($user) {
            return $this->canUserSeeThisEvent($event, $user);
        })->values();

        $total = $events->count();

        if ($events->isEmpty()) {
            return response()->json(['message' => 'No events found'], 200);
        }

        return response()->json([
            'data' => [
                'events' => $events,
            ],
            'meta' => [
                'current_page' => $request->page,
                'total_pages' => ceil($total / $perPage),
                'total_events' => $total,
                'timestamp' => now()->format('d-m-Y\TH:i:s. T'),
            ],
        ]);
    }


}
