<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Event;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

//delete old events
Artisan::command('delete:old_events', function () {
    $eventIds = Event::where('date_time_end', '<', now())->pluck('id');

    Event::whereIn('id', $eventIds)->delete();
})->purpose('Delete old events')->hourly();
