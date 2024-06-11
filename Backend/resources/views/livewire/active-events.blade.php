<div class="bg-base-200 p-4 px-8 flex gap-3 items-center w-min rounded-lg">
    <div class="flex gap-6 items-center">

        <div class="flex flex-col gap-3 justify-center">
            <p class="mb-1 -mt-2 -ml-4 whitespace-nowrap font-semibold">{{ __('custome.eventsStats') }}</p>
            <p>{{__('custome.activeEvents')}}</p>
            <div class="flex flex-col gap-3 w-min">
                <div class="radial-progress border-4 text-secondary border-base-300 bg-base-300"
                    style="--value:{{ $percentageActiveEvents }}; --size:6rem; --thickness: 8px;" role="progressbar">
                    <span class="text-neutral font-semibold font-mono">{{ $percentageActiveEvents }}%</span>
                </div>
                <p class="w-full text-center font-medium font-mono">{{ $activeEvents }} / {{ $totalEvents }}</p>
            </div>
        </div>

        <div class="flex flex-col gap-3 h-4/5">
            <div class="flex flex-nowrap items-center gap-2">
                @if ($averageOccupancyPercentage == 100)
                    <div class="flex w-3 h-3 rounded-full bg-info"></div>
                @elseif($averageOccupancyPercentage >= 65)
                    <div class="flex w-3 h-3 rounded-full bg-success"></div>
                @elseif($averageOccupancyPercentage >= 30)
                    <div class="flex w-3 h-3 rounded-full bg-warning"></div>
                @else
                    <div class="flex w-3 h-3 rounded-full bg-error"></div>
                @endif
                <span class="whitespace-nowrap">{{__('custome.eventOcupancyAvg')}}: </span>
                <span class="ml-auto whitespace-nowrap">{{ $averageOccupancyPercentage }}%</span>
            </div>

            <div class="flex flex-nowrap items-center gap-2">
                @if ($averageEventsPerMonth == 10)
                    <div class="flex w-3 h-3 rounded-full bg-info"></div>
                @elseif($averageEventsPerMonth >= 5)
                    <div class="flex w-3 h-3 rounded-full bg-success"></div>
                @elseif($averageEventsPerMonth >= 1)
                    <div class="flex w-3 h-3 rounded-full bg-warning"></div>
                @else
                    <div class="flex w-3 h-3 rounded-full bg-error"></div>
                @endif
                <span class="whitespace-nowrap">{{__('custome.eventsPerMonthAvg')}}: </span>
                <span class="ml-auto whitespace-nowrap">{{ $averageEventsPerMonth }}</span>
            </div>

            <div class="flex flex-nowrap items-center gap-2">
                @if($averageEventDuration >= 0.5)
                    <div class="flex w-3 h-3 rounded-full bg-success"></div>
                @elseif($averageEventDuration >= 0.25)
                    <div class="flex w-3 h-3 rounded-full bg-warning"></div>
                @else
                    <div class="flex w-3 h-3 rounded-full bg-error"></div>
                @endif
                <span class="whitespace-nowrap">{{__('custome.eventDurationAvg')}}: </span>
                <span class="ml-auto whitespace-nowrap">{{ $averageEventDuration }} d</span>
            </div>
        </div>
    </div>
</div>
