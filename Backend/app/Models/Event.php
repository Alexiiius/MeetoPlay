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

    public function participants() {
        return $this->belongsToMany(User::class, 'event_users', 'event_id', 'user_id');
    }

    public function insertParticipant($user_id) {
        if ($this->participants()->where('users.id', $user_id)->exists()) {
            throw new \Exception('Already a participant');
        }
    
        $this->participants()->attach($user_id);
        $this->participants()->where('users.id', $user_id)->updateExistingPivot($user_id, ['created_at' => now()]);
        $this->participants()->where('users.id', $user_id)->updateExistingPivot($user_id, ['updated_at' => now()]);
        $this->save();
    }
    
    public function removeParticipant($user_id) {
        if (!$this->participants()->where('users.id', $user_id)->exists()) {
            throw new \Exception('Not a participant');
        }
    
        $this->participants()->detach($user_id);
    }


    
}