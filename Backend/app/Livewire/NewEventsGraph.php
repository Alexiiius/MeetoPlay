<?php

namespace App\Livewire;

use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class NewEventsGraph extends Component
{
  public function render()
  {
    $events = Event::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
      ->groupBy('date')
      ->get()
      ->pluck('count', 'date');

    $events = $events->sortKeys();

    return view('livewire.new-events-graph', ['events' => $events]);
  }
}
