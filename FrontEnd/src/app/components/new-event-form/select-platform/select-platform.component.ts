import { NewEventFormService } from './../../../services/new-event-form-service.service';
import { Platform } from './../../../models/platform';
import { Game } from './../../../models/game';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
;
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-platform',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './select-platform.component.html',
  styleUrl: './select-platform.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectPlatformComponent),
      multi: true
    }
  ]
})
export class SelectPlatformComponent implements OnInit, ControlValueAccessor {

  options: Platform[] = [];
  selectedGame: Game | null;

  @Input() isInvalid: boolean | undefined ;

  constructor(private newEventFormService: NewEventFormService) { }

  value: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  selectPlatform(platform: Platform) {
    this.value = platform;
    this.onChange(platform);
    this.onTouch();
    console.log(platform);
  }

  ngOnInit(): void {
      this.newEventFormService.selectedGame$.subscribe(game => {
        this.selectedGame = game;
        this.options = game ? game.platforms: [{id: 0, name: 'No game selected'}];
        this.value = null;
        this.onChange(null);
      });
  }

  onPlatformSelect(platform: string) {
    //TODO handle platform selection
  }
}
