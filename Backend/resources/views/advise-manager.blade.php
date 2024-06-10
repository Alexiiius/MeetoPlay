<x-app-layout>
  <x-slot name="header">
      <div class="flex justify-between">
        <h2 class="font-semibold text-xl text-neutral leading-tight">
            {{ __('custome.Advise Manager') }}
        </h2>
        @livewire('new-advise')
      </div>
  </x-slot>

  <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-base-200 overflow-hidden shadow-sm sm:rounded-lg">
              <div class="p-6 text-neutral max-h-[calc(100vh-235px)]">
                  @livewire('advise-manager')
              </div>
          </div>
      </div>
  </div>
</x-app-layout>
