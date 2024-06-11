<?php

namespace App\Jobs;

use App\Events\GotMessage;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log as Logger;

class SendMessage implements ShouldQueue {

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public array $message;

    public function __construct(public Message $data) {
        $this->message = [
            'message_id' => $data->id,
            'from_user_id' => $data->from_user_id,
            'to_user_id' => $data->to_user_id,
            "from_user_name" => $data->from_user_name,
            "to_user_name" => $data->to_user_name,
            'text' => $data->text,
            'time' => $data->time,
        ];
    }

    public function handle(): void {
        // Logger::info("dispatching" . json_encode($this->message));
        GotMessage::dispatch($this->message);
    }

}