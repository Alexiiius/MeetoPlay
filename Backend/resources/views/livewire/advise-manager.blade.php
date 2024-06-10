<div class="overflow-y-auto max-h-[calc(100vh-300px)]">
    <table class="table table-pin-rows">
        <!-- head -->
        <thead class="border-b-2 border-primary">
            <tr>
                <th>{{ __('custome.Id') }}</th>
                <th>{{ __('custome.title') }}</th>
                <th>{{ __('custome.description') }}</th>
                <th>{{ __('custome.time_start') }}</th>
                <th>{{ __('custome.time_end') }}</th>
                <th>{{ __('custome.Status') }}</th>
                <th>{{ __('custome.Actions') }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($advises as $advise)
                <tr class="border-b border-base-300 hover:bg-base-300" wire:key="{{ $advise->id }}">
                    <th>{{ $advise->id }}</th>
                    <td>{{ $advise->title }}</td>
                    <td>{{ $advise->description }}</td>
                    <td>{{ \Carbon\Carbon::parse($advise->time_start)->format('d/m/Y H:i') }}</td>
                    <td>{{ \Carbon\Carbon::parse($advise->time_end)->format('d/m/Y H:i') }}</td>
                    <td>
                        @php
                            $now = \Carbon\Carbon::now();
                            $start = \Carbon\Carbon::parse($advise->time_start);
                            $end = \Carbon\Carbon::parse($advise->time_end);
                        @endphp
                        @if ($now->between($start, $end))
                            <div class="flex items-center gap-2">
                                <span class="inline-block w-3 h-3 rounded-full bg-success"></span>
                                <span>{{__('custome.Open')}}</span>
                            </div>
                        @else
                            <div class="flex items-center gap-2">
                                <span class="inline-block w-3 h-3 rounded-full bg-error"></span>
                                <span>{{__('custome.Close')}}</span>
                            </div>
                        @endif
                    </td>
                    <td>
                        <div class="flex gap-2">
                            @livewire('new-advise', ['isUpdate' => true, 'advise' => $advise], key($advise->id))
                            @livewire('delete-advise', ['advise' => $advise], key($advise->id))
                        </div>
                    </td>
                </tr>
            @endforeach

        </tbody>
    </table>
</div>
