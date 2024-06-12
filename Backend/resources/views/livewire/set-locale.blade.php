<x-dropdown align="right" width="48">
    <x-slot name="trigger">
        <button
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-400 bg-base-200 hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">

            @if (session('locale') == 'en')
                <x-eeuu-flag />
            @else
                <x-spain-flag />
            @endif

            <div class="ml-2" x-text="$wire.currentLocale"></div>


            <div class="ms-1">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </button>
    </x-slot>

    <x-slot name="content">
        <div class="flex flex-col gap-1">
            <button class="flex gap-2 hover:bg-base-300 p-1 rounded" wire:click="switchLanguage('en')">
                <x-eeuu-flag />
                <span>English</span>
            </button>
            <button class="flex gap-2 hover:bg-base-300 p-1 rounded" wire:click="switchLanguage('es')">
                <x-spain-flag />
                <span>Español</span>
            </button>
        </div>
    </x-slot>
</x-dropdown>
