<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

//delete old events
Artisan::command('delete:old_events', function () {
    $events = \App\Models\Event::all();
    foreach ($events as $event) {
        if ($event->date_time_end < now()) {
            $event->softDelete();
        }
    }
})->purpose('Delete old events')->hourly();
