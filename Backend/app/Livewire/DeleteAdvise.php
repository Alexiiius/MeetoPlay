<?php

namespace App\Livewire;

use Livewire\Component;

class DeleteAdvise extends Component
{
    public $isOpen = false;
    public $advise;

    public function mount($advise)
    {
        $this->advise = $advise;
    }

    public function showModal()
    {
        $this->isOpen = true;
    }

    public function hideModal()
    {
        $this->isOpen = false;
    }

    public function deleteAdvise()
    {
        $this->advise->delete();
        $this->hideModal();

        // Emit an event to refresh the advise list in the parent component
        $this->dispatch('adviseDeleted');
    }

    public function render()
    {
        return view('livewire.delete-advise');
    }
}
