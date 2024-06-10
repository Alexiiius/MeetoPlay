@props(['disabled' => false])

<input type="datetime-local" {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'border-base-300 bg-base-100 text-neutral focus:border-primary rounded-md shadow-sm']) !!}>
