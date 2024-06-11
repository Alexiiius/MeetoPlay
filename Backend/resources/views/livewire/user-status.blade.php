<div>
    @switch($status)
      @case('Online')
          <span class="flex h-3 w-3 rounded-full bg-success"></span>
          @break

      @case('Afk')
          <span class="flex h-3 w-3 rounded-full bg-warning"></span>
          @break

      @case('Dnd')
          <span class="flex h-3 w-3 rounded-full bg-error"></span>
          @break

      @case('Invisible')
      @case('Offline')
          <span class="flex h-3 w-3 rounded-full bg-gray-500"></span>
          @break

      @default
          <span>Unknown status</span>
  @endswitch
</div>
