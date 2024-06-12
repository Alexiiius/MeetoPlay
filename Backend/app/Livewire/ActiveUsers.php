<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Component;

class ActiveUsers extends Component
{
  public $percentageActiveUsers;
  public $totalUsers;
  public $activeUsers;
  public $usersOnline;
  public $usersOffline;
  public $usersAfk;
  public $usersDnd;
  public $usersInvisible;

  public function mount()
  {
    $this->getStats();
  }

  public function getStats()
  {
    $this->totalUsers = User::where('is_admin', '!=', 1)->count();
    $this->activeUsers = User::where('status', '!=', 'Offline')->where('is_admin', '!=', 1)->count();

    $this->usersOnline = User::where('status', 'Online')->where('is_admin', '!=', 1)->count();
    $this->usersOffline = User::where('status', 'Offline')->where('is_admin', '!=', 1)->count();
    $this->usersAfk = User::where('status', 'Afk')->where('is_admin', '!=', 1)->count();
    $this->usersDnd = User::where('status', 'Dnd')->where('is_admin', '!=', 1)->count();
    $this->usersInvisible = User::where('status', 'Invisible')->where('is_admin', '!=', 1)->count();

    $this->percentageActiveUsers = round(($this->activeUsers / $this->totalUsers) * 100);
  }

  public function render()
  {
    return view('livewire.active-users');
  }
}
