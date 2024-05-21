<?php

namespace App\Jobs;

use App\Events\GotMessage;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldQueue {

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Message $message) {
        //
    }

    public function handle(): void {
        GotMessage::dispatch([
            'id' => $this->message->id,
            'from_user_id' => $this->message->user_id,
            'to_user_id' => $this->message->to_user_id,
            "from_user_name" => $this->message->from_user_name,
            "to_user_name" => $this->message->to_user_name,
            'text' => $this->message->text,
            'time' => $this->message->time,
        ]);
    }

}