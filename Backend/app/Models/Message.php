<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Message extends Model {

    use HasFactory;

    public $table = 'messages';
    protected $fillable = ['id', 'from_user_id', 'to_user_id', 'from_user_name', 'to_user_name', 'text'];

    public function fromUser(): BelongsTo {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser(): BelongsTo {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function getAuthorName(){
        return $this->fromUser()->getFullNameAttribute();
    }

    public function getReceiverName(){
        return $this->toUser()->getFullNameAttribute();
    }

    public function getTimeAttribute(): string {
        return date(
            "d M Y, H:i:s",
            strtotime($this->attributes['created_at'])
        );
    }

}