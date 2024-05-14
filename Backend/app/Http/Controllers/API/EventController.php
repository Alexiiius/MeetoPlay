<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


use App\Models\EventRequirement;
use App\Models\User;
use App\Models\Event;

class EventController extends Controller
{
    

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
            'data.event.privacy' => 'required|string',
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
                'timestamp' => now(),
            ],
        ], 201);
    }

    public function show($id) {
        
        $event = Event::with('event_requirements')->find($id);

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
                'timestamp' => now(),
            ],
        ]);
    }

    public function showPublicEvents($page) {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $events = Event::with('event_requirements')
            ->with(['participants' => function ($query) {
                $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
            } ])
            ->where('privacy', 'public')
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
                'timestamp' => now(),
            ],
        ]);
    }

    public function showHiddenEvents($page) {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $userId = auth()->id();
        $events = Event::with('event_requirements')
                ->with(['participants' => function ($query) {
                    $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
                } ])
                ->where('privacy', 'hidden')
               ->where('event_owner_id', $userId)
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
                'timestamp' => now(),
            ],
        ]);
    }

    public function showMyEvents($page) {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $userId = auth()->id();
        $events = Event::with('event_requirements')
                ->with(['participants' => function ($query) {
                    $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
                } ])
                ->where('event_owner_id', $userId)
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
                'timestamp' => now(),
            ],
        ]);
    }

    public function showFriendsEvents($page) {
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $userId = auth()->id();
        $friends = User::find($userId)->friends();
        $events = Event::whereIn('event_owner_id', $friends)
                ->where('privacy', '!=', 'hidden')
                ->with('event_requirements')
                ->with(['participants' => function ($query) {
                    $query->select('users.id', 'users.tag', 'users.name', 'users.avatar');
                } ])
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
                'timestamp' => now(),
            ],
        ]);
    }

    public function update(Request $request, Event $event) {
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
            'data.event.privacy' => 'required|string',
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
                'timestamp' => now(),
            ],
        ], 200);

    }


    public function destroy(Request $request) {
        
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
                'timestamp' => now(),
            ],
        ], 200);



    }
}
