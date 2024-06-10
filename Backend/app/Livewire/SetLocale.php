<?php

namespace App\Livewire;

use Illuminate\Support\Facades\App;
use Livewire\Component;

class SetLocale extends Component
{
  public $currentLocale;

  public function mount()
  {
    $this->currentLocale = App::getLocale();
  }

  public function switchLanguage($locale)
  {
    App::setLocale($locale);
    $this->currentLocale = $locale;
    session()->put('locale', $locale);
    return redirect(request()->header('Referer'));
  }

  public function render()
  {
    return view('livewire.set-locale');
  }
}
