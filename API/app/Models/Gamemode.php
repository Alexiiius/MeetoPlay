<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Game;

class Gamemode extends Model
{
    use HasFactory;

    protected $fillable = [
        'gamemode',
        'description',
        'ranked',
        'max_players',
        'min_players',
        'ranks',
        'sceneario_name',
        'game_id'
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

}
