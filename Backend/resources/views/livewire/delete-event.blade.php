<div>
  <button class="btn btn-square btn-ghost btn-sm text-error" wire:click="showModal()">
      <i class='bx bx-trash bx-sm'></i>
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
                  <div class="bg-base-200 text-neutral px-4 pt-5 pb-4 w-80">
                      <div class="flex flex-col gap-2 w-full">

                          <h2>{{__('custome.deleteEventConfirmation')}}</h2>
                          <p><span class="font-bold">{{__('custome.id')}}: </span>{{$event->id}}</p>

                          <div class="flex justify-between mt-5 w-full">
                            <x-secondary-button wire:click="hideModal()" class="btn-sm">
                                {{ __('custome.Cancel') }}
                            </x-secondary-button>
                            <form wire:submit="deleteEvent()">
                              <x-primary-button type=submit class="btn-sm">
                                  {{ __('custome.Confirm') }}
                              </x-primary-button>
                            </form>
                          </div clas>

                      </div>
                  </div>
              </div>
          </div>
      </div>
  @endif
</div>
