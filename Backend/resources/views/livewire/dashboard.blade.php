<div>
    <div class="flex flex-col gap-6">
        <div class="flex gap-6 justify-center">
            @livewire('active-users', key('active-users'))
            @livewire('active-events', key('active-events'))
            @livewire('chats-stats', key('chats-stats'))
        </div>
        <div class="flex gap-6 justify-center mt-6">
            @livewire('new-users-graph', key('new-users-graph'))
            @livewire('new-events-graph', key('new-events-graph'))
        </div>
    </div>
</div>
