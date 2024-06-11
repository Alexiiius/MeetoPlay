<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advises extends Model {
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'time_start',
        'time_end',
    ];

}
