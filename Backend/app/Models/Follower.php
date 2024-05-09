<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'follower_id'
    ];

    public function followers() {
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
    }

    public function following() {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
    }




}
