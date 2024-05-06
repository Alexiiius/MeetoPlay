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

    public function verificationUrl() {
        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $this->id, 'hash' => sha1($this->email), 'token' => $this->email_verification_token]
        );
    }

    public function generateEmailVerificationToken() {
        $token = hash_hmac('sha256', Str::random(40), config('app.key'));

        $this->forceFill([
            'email_verification_token' => hash('sha256', $token),
        ])->save();

        return $token;
    }


}
