<div class="bg-base-200 p-4 px-8 flex gap-3 items-center w-min rounded-lg">
  <div class="flex gap-6 items-center">

      <div class="flex flex-col gap-3 justify-center">
          <p class="mb-1 -mt-2 -ml-4 whitespace-nowrap font-semibold">{{ __('custome.usersStats') }}</p>
          <p>{{ __('custome.activeUsers') }}</p>
          <div class="flex flex-col gap-3 w-min">
              <div class="radial-progress text-success border-4 border-base-300 bg-base-300"
                  style="--value:{{ $percentageActiveUsers }}; --size:6rem; --thickness: 8px;" role="progressbar">
                  <span class="text-neutral font-semibold font-mono">{{ $percentageActiveUsers }}%</span>
              </div>
              <p class="w-full text-center font-medium font-mono">{{ $activeUsers }} / {{ $totalUsers }}</p>
          </div>
      </div>

      <div class="flex flex-col justify-between h-4/5 gap-2">
          <div class="flex items-center flex-nowrap gap-2">
              @livewire('user-status', ['status' => 'Online'])
              <div class="whitespace-nowrap flex justify-between w-full">
                  <span class="mr-3">{{ __('custome.Online') }}:</span> <span
                      class="ml-auto font-mono">{{ $usersOnline }}</span>
              </div>
          </div>

          <div class="flex items-center flex-nowrap gap-2">
              @livewire('user-status', ['status' => 'Dnd'])
              <div class="whitespace-nowrap flex justify-between w-full">
                  <span class="mr-3">{{ __('custome.Dnd') }}:</span> <span
                      class="ml-auto font-mono">{{ $usersDnd }}</span>
              </div>
          </div>

          <div class="flex items-center flex-nowrap gap-2">
              @livewire('user-status', ['status' => 'Afk'])
              <div class="whitespace-nowrap flex justify-between w-full">
                  <span class="mr-3">{{ __('custome.Afk') }}:</span> <span
                      class="ml-auto font-mono">{{ $usersAfk }}</span>
              </div>
          </div>

          <div class="flex items-center flex-nowrap gap-2">
              @livewire('user-status', ['status' => 'Invisible'])
              <div class="whitespace-nowrap flex justify-between w-full">
                  <span class="mr-3">{{ __('custome.Invisible') }}:</span> <span
                      class="ml-auto font-mono">{{ $usersInvisible }}</span>
              </div>
          </div>

          <div class="flex items-center flex-nowrap gap-2">
              @livewire('user-status', ['status' => 'Offline'])
              <div class="whitespace-nowrap flex justify-between w-full">
                  <span class="mr-3">{{ __('custome.Offline') }}:</span> <span
                      class="ml-auto font-mono">{{ $usersOffline }}</span>
              </div>
          </div>
      </div>
  </div>
</div>
