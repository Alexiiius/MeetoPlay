<?php

namespace App\Livewire;

use App\Models\Event;
use Livewire\Component;

class EventsManager extends Component
{
  public $events;
  public $processedEvents;
  public $isOpen = false;
  public Event $deletingEvent;

  protected $listeners = ['eventDeleted' => 'updateEventList'];

  public function updateEventList()
  {
    $this->reset('events');
    $this->events = Event::all();
    $this->mount();
  }

  public function mount()
  {
    $this->events = Event::all();

    $this->processedEvents = $this->events->map(function ($event) {
      return [
        'id' => $event->id,
        'event_title' => $event->event_title,
        'game_name' => $event->game_name,
        'game_mode' => $event->game_mode,
        'platform' => $event->platform,
        'duration' => $this->calculateDuration($event),
        'inscription_status' => $this->isInscriptionPeriod($event),
        'event_status' => $this->isEventInProgress($event),
        'participants' => $event->participants()->count() . '/' . $event->max_participants,
        'real_event' => $event,
      ];
    });
  }

  public function deleteEvent ()
  {
    $this->deletingEvent->delete();
    $this->hideModal();
    $this->updateEventList();
  }

  public function showModal(Event $event) {
    $this->deletingEvent = $event;
    $this->isOpen = true;
  }

  public function hideModal() {
    $this->isOpen = false;
  }

  private function calculateDuration($event)
  {
    $begin = new \DateTime($event->date_time_begin);
    $end = new \DateTime($event->date_time_end);
    $interval = $begin->diff($end);

    $formattedInterval = "";
    if ($interval->d > 0) {
      $formattedInterval .= $interval->d . "d ";
    }
    if ($interval->h > 0 || $interval->d > 0) {
      $formattedInterval .= $interval->h . "h ";
    }
    $formattedInterval .= $interval->i . "m";

    return $formattedInterval;
  }

  private function isInscriptionPeriod($event)
  {
    $now = new \DateTime();
    $begin = new \DateTime($event->date_time_inscription_begin);
    $end = new \DateTime($event->date_time_inscription_end);

    return $begin <= $now && $now <= $end;
  }

  private function isEventInProgress($event)
  {
      $now = new \DateTime();
      $begin = new \DateTime($event->date_time_begin);
      $end = new \DateTime($event->date_time_end);

      return $begin <= $now && $now <= $end;
  }

  public function render()
  {
    return view('livewire.events-manager');
  }
}
