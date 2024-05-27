<?php

namespace App\Models;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Event;
use App\Models\Message;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'date_of_birth',
        'avatar',
        'status',
        'bio',
        'socials',
        'is_admin'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function boot() {
        parent::boot();

        static::creating(function ($user) {
            $user->tag = User::max('tag') + 1;
        });
    }

    // return tag number with 6 digits (e.g. 0001) or (e.g. 0123)
    public function getTagAttribute($value) {
        return str_pad($value, 4, '0', STR_PAD_LEFT);
    }

    // return the user name
    public function getNameAttribute($value) {
        return $value;
    }

    // return the user full name with the tag number (e.g. Alexius#0001)
    public function getFullNameAttribute() {
        return $this->name . '#' . $this->tag;
    }

    // return the user avatar
    public function getAvatarAttribute($value) {
        return asset('storage/' . $value);
    }

    // return the users age
    public function getAgeAttribute() {
        return $this->date_of_birth->age;
    }

    // return the users status
    public function getStatusAttribute($value) {
        return ucfirst($value);
    }

    //return the users socials
    public function getSocialsAttribute($value) {
        return json_decode($value);
    }

    //generate a temeporal verification url of 60 minutes
    public function verificationUrl() {
        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $this->id, 'hash' => sha1($this->email), 'token' => $this->email_verification_token]
        );
    }

    //generate a token for email verification and save it into the database
    public function generateEmailVerificationToken() {
        $token = hash_hmac('sha256', Str::random(40), config('app.key'));

        $this->forceFill([
            'email_verification_token' => hash('sha256', $token),
        ])->save();

        return $token;
    }

    public function sendEmailVerificationNotification() {
        $this->notify(new VerifyEmail);
    }

    public function followers() {
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
    }

    public function following() {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
    }

    public function followingArray() {
        return $this->following()->get()->pluck('id');
    }

    public function events() {
        return $this->belongsToMany(Event::class, 'event_users', 'user_id', 'event_id');
    }

    public function friends() {
        $followers = $this->followers()->get();
        $following = $this->following()->get();
        $friends = User::whereHas('followers', function ($query) {
            $query->where('follower_id', $this->id);
        })->whereHas('following', function ($query) {
            $query->where('user_id', $this->id);
        })->get();
    
        return $friends->pluck('id');
    }

    public function getFollowersWithTags() {
        return $this->followers()->get()->map(function ($follower) {
            return [
                'id' => $follower->id,
                'tag' => $follower->tag,
                'name' => $follower->name,
                'full_tag' => $follower->getFullNameAttribute(),
                'avatar' => $follower->avatar,
                'status' => $follower->status,
            ];
        });
    }

    public function getFollowingWithTags() {
        return $this->following()->get()->map(function ($following) {
            return [
                'id' => $following->id,
                'tag' => $following->tag,
                'name' => $following->name,
                'full_tag' => $following->getFullNameAttribute(),
                'avatar' => $following->avatar,
                'status' => $following->status,
            ];
        });
    }

    public function sentMessages(): HasMany {
        return $this->hasMany(Message::class, 'from_user_id');
    }

    public function receivedMessages(): HasMany {
        return $this->hasMany(Message::class, 'to_user_id');
    }

    public function gameStats() {
        return $this->hasMany(GameUserStats::class, 'user_id', 'id');
    }

    public function setStatus($status) {

        if (!in_array($status, ['online', 'offline', 'afk', 'dnd', 'invisible'])) {
            throw new \Exception('Invalid status.');
        }

        $this->status = $status;
        $this->save();
    }

}
