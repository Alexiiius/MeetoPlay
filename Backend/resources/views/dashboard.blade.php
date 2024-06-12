<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-neutral leading-tight">
            {{ __('custome.Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow-sm sm:rounded-lg">
                <div class="text-neutral">
                  @livewire('dashboard')
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
