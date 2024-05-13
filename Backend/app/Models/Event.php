<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\EventRequirement;

class Event extends Model {
    use HasFactory;

    protected $fillable = [
        'event_title',
        'game_id',
        'game_pic',
        'game_name',
        'game_mode',
        'platform',
        'event_owner_id',
        'date_time_begin',
        'date_time_end',
        'date_time_inscription_begin',
        'date_time_inscription_end',
        'max_participants',
        'privacy',
        'event_requirement_id',
    ];

    public function owner() {
        return $this->belongsTo(User::class, 'event_owner_id');
    }

    public function event_requirements() {
        return $this->belongsTo(EventRequirement::class, 'event_requirement_id');
    }


    
}