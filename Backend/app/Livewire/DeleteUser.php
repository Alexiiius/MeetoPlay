<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Component;

class DeleteUser extends Component
{
  public User $user;
  public $isOpen = false;

  public function mount(User $user)
  {
    $this->user = $user;
  }

  public function showModal() {
    $this->isOpen = true;
  }

  public function hideModal() {
    $this->isOpen = false;
  }

  public function deleteUser()
  {
    $this->user->delete();
    $this->hideModal();

    // Emit an event to refresh the user list in the parent component
    $this->dispatch('userDeleted');
  }

  public function render()
  {
    return view('livewire.delete-user');
  }
}
