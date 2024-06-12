<div class="bg-base-200 p-4 px-8 flex gap-3 items-center w-min rounded-lg">
    <div class="flex gap-6 items-center">
        <div class="flex flex-col gap-3 justify-center">
            <p class="mb-1 -mt-2 -ml-4 whitespace-nowrap font-semibold">{{ __('custome.chatsStats') }}</p>
            <p>{{ __('custome.activeChats') }}</p>
            <div class="flex flex-col gap-3 w-min">
                <div class="radial-progress text-primary border-4 border-base-300 bg-base-300"
                    style="--value:{{ $activeChatsPercentage }}; --size:6rem; --thickness: 8px;" role="progressbar">
                    <span class="text-neutral font-semibold font-mono">{{ $activeChatsPercentage }}%</span>
                </div>
                <p class="w-full text-center font-medium font-mono">{{ $activeChats }} / {{ $totalChats }}</p>
            </div>
        </div>
    </div>

</div>
</div>
