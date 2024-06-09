<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Component;

class UserManager extends Component
{
  public $users;

  protected $listeners = ['userUpdated' => 'updateUserList', 'userDeleted' => 'updateUserList'];

  public function updateUserList()
  {
    $this->reset('users');
    $this->users = User::where('is_admin', '!=', 1)->get();
  }

  public function mount()
  {
    $this->users = User::where('is_admin', '!=', 1)->get();
  }

  public function render()
  {
    return view('livewire.user-manager');
  }
}
