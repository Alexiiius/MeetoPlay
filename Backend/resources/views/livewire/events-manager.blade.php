<div wire:poll.500ms>
    <div class="overflow-y-auto max-h-[calc(100vh-300px)]">
        <table class="table table-pin-rows">
            <!-- head -->
            <thead class="border-b-2 border-primary">
                <tr>
                    <th>{{ __('custome.Id') }}</th>
                    <th>{{ __('custome.title') }}</th>
                    <th>{{ __('custome.game') }}</th>
                    <th>{{ __('custome.gamemode') }}</th>
                    <th>{{ __('custome.platform') }}</th>
                    <th>{{ __('custome.duration') }}</th>
                    <th>{{ __('custome.inscriptionStatus') }}</th>
                    <th>{{ __('custome.eventStatus') }}</th>
                    <th>{{ __('custome.participants') }}</th>
                    <th>{{ __('custome.Actions') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($processedEvents as $event)
                    <tr class="border-b border-base-300 hover:bg-base-300" wire:key="{{ $event['id'] }}">
                        <th>{{ $event['id'] }}</th>
                        <td>{{ $event['event_title'] }}</td>
                        <td>{{ $event['game_name'] }}</td>
                        <td>{{ $event['game_mode'] }}</td>
                        <td>{{ $event['platform'] }}</td>
                        <td>{{ $event['duration'] }}</td>

                        <td>
                            <div class="flex items-center gap-2">
                                @if ($event['inscription_status'])
                                    <div class="flex w-3 h-3 bg-success rounded-full"></div>
                                    <span>{{ __('custome.Open') }}</span>
                                @else
                                    <div class="flex w-3 h-3 bg-error rounded-full"></div>
                                    <span>{{ __('custome.Closed') }}</span>
                                @endif
                            </div>
                        </td>

                        <td>
                            <div class="flex items-center gap-2">
                                @if ($event['event_status'])
                                    <div class="flex w-3 h-3 bg-success rounded-full"></div>
                                    <span>{{ __('custome.Open') }}</span>
                                @else
                                    <div class="flex w-3 h-3 bg-error rounded-full"></div>
                                    <span>{{ __('custome.Closed') }}</span>
                                @endif
                            </div>
                        </td>

                        <td> {{ $event['participants'] }} </td>
                        <td>
                            <button class="btn btn-square btn-ghost btn-sm text-error" wire:click="showModal({{$event['real_event']}})">
                                <i class='bx bx-trash bx-sm'></i>
                            </button>
                        </td>
                    </tr>
                @endforeach

            </tbody>
        </table>
    </div>
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

                            <h2>{{ __('custome.deleteEventConfirmation') }}</h2>
                            <p><span class="font-bold">{{ __('custome.id') }}: </span>{{ $deletingEvent->id }}</p>

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
