<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Platform;
use App\Models\Gamemode;


class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image'
    ];


    // devuelve las plataformas en las que se juega un juego
    public function platforms()
    {
        return $this->belongsToMany(Platform::class);
    }

    // devuelve los modos de juego de un juego
    public function gamemodes()
    {
        return $this->hasMany(Gamemode::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    

}
