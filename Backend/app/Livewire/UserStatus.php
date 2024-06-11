<?php

namespace App\Livewire;

use Livewire\Component;

class UserStatus extends Component
{

  public string $status;

  public function mount($status)
  {
    $this->status = $status;
  }

  public function render()
  {
    return view('livewire.user-status');
  }
}
