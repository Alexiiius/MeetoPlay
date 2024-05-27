<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamemodeStats extends Model {
    use HasFactory;


    protected $fillable = [
        'user_id',
        'game_user_stats_id',
        'gamemode_name',
        'gamemodes_rank'
    ];

    public function gameUserStats() {
        return $this->belongsTo(GameUserStats::class);
    }


}
