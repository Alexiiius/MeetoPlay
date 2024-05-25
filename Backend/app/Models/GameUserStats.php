<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameUserStats extends Model {
    use HasFactory;

    public $table = 'game_user_stats';

    protected $fillable = [
        'game_id',
        'user_id',
        'game_name',
        'hours_played',
        'lv_account',
        'nickname_game',
        'game_pic'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}
