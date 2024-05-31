<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log as Logger;

use App\Models\Message;
use \App\Events\GlobalMessage;

class SendPublicMessage implements ShouldQueue {

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    public array $message;

    public function __construct(public Message $data) {
        $this->message = [
            'from_user_id' => $data->from_user_id,
            "from_user_name" => $data->from_user_name,
            'text' => $data->text,
            'time' => $data->time,
        ];
        
    }


    public function handle(): void{
        // Logger::info("dispatching" . json_encode($this->message));
        GlobalMessage::dispatch($this->message);
    }



}
