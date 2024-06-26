<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\Models\Message;
use App\Models\User;

class GotMessage implements ShouldBroadcast{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // public Message $message;

    // public function __construct(Message $message) {
    //     $this->message = $message;
    // }

    public array $message;

    public function __construct(array $data) {
        $this->message = $data;
    }

    public function broadcastOn(): array {
        
        return [
            new PrivateChannel('App.Models.User.' . $this->message['to_user_id']),
            // new Channel('publico'),
        ];

    }
    



}
