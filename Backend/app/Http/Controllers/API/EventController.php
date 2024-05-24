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


    public function store(Request $request)
    {
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
                'timestamp' => now(),
            ],
        ], 201);
    }

    public function show($id)
    {

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
                'timestamp' => now(),
            ],
        ]);
    }

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
                'timestamp' => now(),
            ],
        ]);
    }

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
                'timestamp' => now(),
            ],
        ]);
    }

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
                'timestamp' => now(),
            ],
        ], 200);
    }


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
                'timestamp' => now(),
            ],
        ], 200);
    }

    public function addParticipant(Request $request)
    {

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
                'timestamp' => now(),
            ],
        ], 200);
    }

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
                'timestamp' => now(),
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


    public function search($search, Request $request) {
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
                'timestamp' => now(),
            ],
        ]);
    }



}
