<?php

namespace App\Livewire;

use App\Models\Message;
use App\Models\User;
use Livewire\Component;

class ChatsStats extends Component
{
  public $totalChats;
  public $activeChats;
  public $activeChatsPercentage;
  public $averageMessagesPerHour;

  public function mount()
  {
    $this->getChatsStats();
  }


  public function getChatsStats()
  {
    // Obtén todas las conversaciones
    $conversations = Message::select('from_user_id', 'to_user_id')
      ->where('from_user_id', '<>', 1)
      ->where('to_user_id', '<>', 1)
      ->groupBy('from_user_id', 'to_user_id')
      ->get();

    $totalChats = $conversations->count();

    // Obtén los chats activos (con un mensaje creado hace menos de 10 minutos)
    $activeChats = $conversations->filter(function ($conversation) {
      $lastMessage = Message::where('from_user_id', $conversation->from_user_id)
        ->where('to_user_id', $conversation->to_user_id)
        ->latest()
        ->first();

      return $lastMessage && $lastMessage->created_at->diffInMinutes(now()) < 30;
    })->count();

    // Guarda las estadísticas en las propiedades del componente
    $this->totalChats = $totalChats;
    $this->activeChats = $activeChats;

    // Calcula el porcentaje de chats activos
    $this->activeChatsPercentage = $totalChats > 0 ? round(($activeChats / $totalChats) * 100) : 0;
  }

  public function render()
  {
    return view('livewire.chats-stats');
  }
}
