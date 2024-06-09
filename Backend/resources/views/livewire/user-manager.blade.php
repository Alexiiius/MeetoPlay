<div wire:poll.500ms>
    <div class="overflow-y-auto max-h-[calc(100vh-300px)]">
        <table class="table table-pin-rows">
            <!-- head -->
            <thead class="border-b-2 border-primary">
                <tr>
                    <th>{{__('custome.Id')}}</th>
                    <th>{{__('custome.Name')}}</th>
                    <th>{{__('custome.Email')}}</th>
                    <th>{{__('custome.Email verified')}}</th>
                    <th>{{__('custome.Status')}}</th>
                    <th>{{__('custome.Actions')}}</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                    <tr class="border-b border-base-300 hover:bg-base-300" wire:key="{{ $user->id }}">
                        <th>{{ $user->id }}</th>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>
                            @if ($user->email_verified_at !== null)
                            <i class='bx bx-check bx-sm text-success'></i>
                            @else
                            <i class='bx bx-x bx-sm text-error'></i>
                            @endif
                        </td>
                        <td>
                          @livewire('user-status', ['status' => $user->status], key('status-' . $user->id))
                        </td>
                        <td class="flex gap-2">
                          @livewire('edit-user', ['user' => $user], key('edit-' . $user->id))
                          @livewire('delete-user', ['user' => $user], key('delete-' . $user->id))
                      </td>
                    </tr>
                @endforeach

            </tbody>
        </table>
    </div>
</div>
