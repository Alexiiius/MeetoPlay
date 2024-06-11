<div>
    @if ($isUpdate)
        <button class="btn btn-square btn-ghost btn-sm text-secondary" wire:click="showModal()">
            <i class='bx bx-edit bx-sm'></i>
        </button>
    @else
        <x-primary-button type="submit" class="btn-sm" wire:click="showModal()">
            <i class='bx bx-plus bx-sm'></i> {{ __('custome.newAdvise') }}
        </x-primary-button>
    @endif

    @if ($isOpen)
        <div class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div class="fixed inset-0 transition-opacity bg-clip-padding backdrop-filter backdrop-blur-sm">
                    <div class="absolute inset-0 bg-base-100 opacity-60 "></div>
                </div>
                <!-- ... -->
                <div class="inline-block align-bottom bg-base-200 rounded-lg border border-base-300 text-left overflow-hidden transform transition-all"
                    role="dialog" aria-modal="true" aria-labelledby="modal-headline">


                    <div class="bg-base-200 text-neutral px-4 pt-5 pb-4 w-96">
                        <div class="mt-3 flex items-center w-full">

                            <form wire:submit="save" class="w-full">
                                <div class="mb-4">
                                    <x-input-label for="title" :value="__('custome.title')" />
                                    <x-text-input wire:model="title" id="title" class="block mt-1 w-full"
                                        type="text" name="title" required autofocus />
                                    <x-input-error :messages="$errors->get('title')" class="mt-2" />
                                </div>
                                <div class="mb-4">
                                    <x-input-label for="description" :value="__('custome.description')" />
                                    <x-textarea-input wire:model="description" id="description"
                                        class="block mt-1 w-full" type="description" name="description" required />
                                    <x-input-error :messages="$errors->get('description')" class="mt-2" />
                                </div>
                                <div class="mb-4">
                                    <x-input-label for="time_start" :value="__('custome.time_start')" />
                                    <x-datetime-input wire:model="time_start" id="time_start" class="block mt-1 w-full"
                                        type="text" name="time_start" required />
                                    <x-input-error :messages="$errors->get('time_start')" class="mt-2" />
                                </div>
                                <div class="mb-4">
                                    <x-input-label for="time_end" :value="__('custome.time_end')" />
                                    <x-datetime-input wire:model="time_end" id="time_end" class="block mt-1 w-full"
                                        type="text" name="time_end" required />
                                    <x-input-error :messages="$errors->get('time_end')" class="mt-2" />
                                </div>
                                <div class="flex items-center justify-between">
                                    <x-secondary-button wire:click="hideModal()" class="btn-sm">
                                        {{ __('custome.Cancel') }}
                                    </x-secondary-button>
                                    <x-primary-button type="submit" class="btn-sm">
                                        {{ __('custome.Save') }}
                                    </x-primary-button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>
