<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Event;

class EventRequirement extends Model {
    use HasFactory;

    protected $fillable = [
        'event_id',
        'max_level',
        'min_level',
        'max_rank',
        'min_rank',
        'min_hours_played',
        'max_hours_played',
    ];

    public function event()
    {
        return $this->hasOne(Event::class, 'id', 'event_id');
    }
}