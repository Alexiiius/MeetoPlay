<?php

namespace App\Livewire;

use App\Models\Event;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class DeleteEvent extends Component
{
  public Event $event;
  public string $id;
  public $isOpen = false;

  public function mount()
  {
    $this->event = Event::findOrFail($this->id);
  }

  public function showModal()
  {
    $this->isOpen = true;
  }

  public function hideModal()
  {
    $this->isOpen = false;
  }

  public function deleteEvent(string $id)
  {

    $event = Event::find($id);

    $event->delete();

    $this->hideModal();

    $this->dispatch('eventDeleted');
  }

  public function render()
  {
    return view('livewire.delete-event');
  }
}
