<?php

namespace App\Livewire;

use App\Models\Event;
use Livewire\Component;

class ActiveEvents extends Component
{
  public $events;
  public $activeEvents;
  public $totalEvents;
  public $percentageActiveEvents;
  public $averageOccupancyPercentage;
  public $averageEventsPerMonth;
  public $averageEventDuration;

  public function mount()
  {
    $this->getEventsStats();
  }

  public function getEventsStats()
  {
    $this->events = Event::with('participants')->get();

    //Calculo del porcentaje de ocupación promedio
    $this->activeEvents = $this->events->where('date_time_begin', '<=', now())
      ->where('date_time_end', '>=', now())
      ->count();
    $this->totalEvents = $this->events->count();
    $this->percentageActiveEvents = round($this->activeEvents / $this->totalEvents * 100);

    $occupancyPercentages = $this->events->map(function ($event) {
      $currentOccupancy = $event->participants->count();
      $maxParticipants = $event->max_participants;

      if ($maxParticipants == 0) {
        return 0;
      }
      return ($currentOccupancy / $maxParticipants) * 100;
    });

    $this->averageOccupancyPercentage = round($occupancyPercentages->average());

    //Calculo de la cantidad de eventos creados en el último mes
    $oneYearAgo = now()->subYear();
    $eventsLastYear = Event::whereDate('created_at', '>=', $oneYearAgo)->get();

    $this->averageEventsPerMonth = round($eventsLastYear->count() / 12, 1);

    //Calculo de duración media de los eventos en horas
    $eventsDuration = $this->events->map(function ($event) {
      $dateBegin = \Carbon\Carbon::parse($event->date_time_begin);
      $dateEnd = \Carbon\Carbon::parse($event->date_time_end);
      return $dateBegin->diffInHours($dateEnd);
    });

    $this->averageEventDuration = round($eventsDuration->average());

  }

  public function render()
  {
    return view('livewire.active-events');
  }
}
