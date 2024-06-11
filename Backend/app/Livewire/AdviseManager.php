<?php

namespace App\Livewire;

use App\Models\Advises;
use Livewire\Component;

class AdviseManager extends Component
{
    public $advises;

    protected $listeners = ['adviseUpdated' => 'updateAdviseList', 'adviseDeleted' => 'updateAdviseList'];

    public function updateAdviseList()
    {
        $this->reset('advises');
        $this->advises = Advises::all();
    }

    public function mount()
    {
        $this->advises = Advises::all();
    }

    public function render()
    {
        return view('livewire.advise-manager');
    }
}
