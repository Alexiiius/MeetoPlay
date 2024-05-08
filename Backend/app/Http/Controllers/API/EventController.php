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
    
    public function index($id) {
        //
    }

    
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

        $event_requirements = EventRequirement::create($request->input('data.event_requirements'));
        $event = Event::create($request->input('data.event'));
        $event->requirement()->associate($event_requirements);
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
        ]);
    }

    public function show($id) {
        $event = Event::find($id);
        $event_requirements = EventRequirement::where('event_id', $id)->first();
        $event_owner = User::find($event->event_owner_id);

        return response()->json([
            'data' => [
                'event' => $event,
                'event_requirements' => $event_requirements,
                'event_owner' => $event_owner,
            ],
            'meta' => [
                'timestamp' => now(),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }
}
