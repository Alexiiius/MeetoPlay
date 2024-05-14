<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventUser extends Model {
    use HasFactory;



    protected $table = 'event_users';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'event_id',
        'user_id',
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }
    
    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


}
