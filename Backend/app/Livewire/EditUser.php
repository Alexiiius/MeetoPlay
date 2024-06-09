<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Attributes\Validate;
use Livewire\Component;

class EditUser extends Component
{
  public User $user;


  #[Validate('required')]
  public $name = '';

  #[Validate('required|email')]
  public $email = '';

  #[Validate('required')]
  public $avatar = '';

  public $isOpen = false;

  public function showModal()
  {

    $this->name = $this->user->name;
    $this->email = $this->user->email;
    $this->avatar = $this->user->avatar;

    $this->isOpen = true;
  }

  public function hideModal()
  {
    $this->isOpen = false;
  }

  public function save()
  {
    $this->validate();

    // Update the user model with the new values
    $this->user->name = $this->name;
    $this->user->email = $this->email;

    $relativeAvatarPath = str_replace(url('/storage/'), '', $this->avatar);
    $relativeAvatarPath = ltrim($relativeAvatarPath, '/');

    $this->user->avatar = $relativeAvatarPath;

    $this->user->save();

    $this->hideModal();

    $this->dispatch('userUpdated'); // Emit an event to refresh the user list in the parent component
  }

  public function render()
  {
    return view('livewire.edit-user');
  }
}
