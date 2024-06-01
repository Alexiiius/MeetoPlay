<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SocialsRule implements ValidationRule {

    public function validate(string $attribute, mixed $value, Closure $fail): void {
        
        //validate if socials is an array with the correct keys of
        //Instagram, X, Discord, Steam, Twitch and Youtube
        //The value of each key must be a string

        if (!is_array($value)) {
            $fail('The socials must be an array');
        }

        if (!array_key_exists('Instagram', $value)) {
            $fail('The socials must have an Instagram key');
        }

        if (!array_key_exists('X', $value)) {
            $fail('The socials must have an X key');
        }

        if (!array_key_exists('Discord', $value)) {
            $fail('The socials must have an Discord key');
        }

        if (!array_key_exists('Steam', $value)) {
            $fail('The socials must have an Steam key');
        }

        if (!array_key_exists('Twitch', $value)) {
            $fail('The socials must have an Twitch key');
        }

        if (!array_key_exists('Youtube', $value)) {
            $fail('The socials must have an Youtube key');
        }

        foreach ($value as $key => $social) {
            if (!is_string($social) && !is_null($social)) {
                $fail('The socials value must be a string or null');
            }
        }
    }
}
