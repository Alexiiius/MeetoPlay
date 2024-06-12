<div>
    <button class="btn btn-square btn-ghost btn-sm text-secondary" wire:click="showModal()">
        <i class='bx bx-edit bx-sm'></i>
    </button>

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
                                    <x-input-label for="name" :value="__('custome.Name')" />
                                    <x-text-input wire:model="name" id="name" class="block mt-1 w-full"
                                        type="text" name="name" required autofocus />
                                    <x-input-error :messages="$errors->get('name')" class="mt-2" />
                                </div>
                                <div class="mb-4">
                                    <x-input-label for="email" :value="__('custome.Email')" />
                                    <x-text-input wire:model="email" id="email" class="block mt-1 w-full"
                                        type="email" name="email" required />
                                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                                </div>
                                <div class="mb-4">
                                    <x-input-label for="avatar" :value="__('custome.Avatar')" />
                                    <x-text-input wire:model="avatar" id="avatar" class="block mt-1 w-full"
                                        type="text" name="avatar" required />
                                    <x-input-error :messages="$errors->get('avatar')" class="mt-2" />
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
