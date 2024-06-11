<?php

namespace App\Livewire;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class NewUsersGraph extends Component
{
  public function render()
  {
    $newUsers = User::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
      ->where('created_at', '>=', now()->subWeek())
      ->groupBy('date')
      ->get()
      ->pluck('count', 'date');

    $newUsers = $newUsers->sortKeys();

    return view('livewire.new-users-graph', ['newUsers' => $newUsers]);
  }
}
