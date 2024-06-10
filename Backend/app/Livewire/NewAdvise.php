<?php

namespace App\Livewire;

use App\Models\Advises;
use Livewire\Component;

class NewAdvise extends Component
{
  public $isOpen = false;
  public $isUpdate = false;
  public $advise;

  public $title = '';
  public $description = '';
  public $time_start = '';
  public $time_end = '';

  protected function rules()
  {
    return [
      'title' => 'required',
      'description' => 'required',
      'time_start' => 'required|date|after_or_equal:now',
      'time_end' => [
        'required',
        'date',
        function ($attribute, $value, $fail) {
          if ($this->time_start && $value < $this->time_start) {
            $fail('La fecha de fin no puede ser anterior a la fecha de inicio.');
          }
        },
      ],
    ];
  }

  public function save()
  {
    $this->validate();

    if (!$this->isUpdate) $this->advise = new Advises;

    // Save the advise
    $this->advise->title = $this->title;
    $this->advise->description = $this->description;
    $this->advise->time_start = $this->time_start;
    $this->advise->time_end = $this->time_end;
    $this->advise->save();

    $this->hideModal();

    $this->dispatch('adviseUpdated'); // Emit an event to refresh the advise list in the parent component
  }


  public function showModal()
  {
    if ($this->isUpdate) {
      $this->title = $this->advise->title;
      $this->description = $this->advise->description;
      $this->time_start = $this->advise->time_start;
      $this->time_end = $this->advise->time_end;
    }

    $this->isOpen = true;
  }


  public function hideModal()
  {
    $this->isOpen = false;
  }

  public function render()
  {
    return view('livewire.new-advise');
  }
}
