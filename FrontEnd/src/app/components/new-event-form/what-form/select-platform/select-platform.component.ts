import { NewEventFormService } from '../../../../services/new-event-form.service';
import { Platform } from '../../../../models/platform';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
;
import { CommonModule } from '@angular/common';
import { FullGame } from '../../../../models/fullgame';
import { filter, map } from 'rxjs';
import { Event } from '../../../../models/event';

@Component({
  selector: 'app-select-platform',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
  selectedGame: FullGame | null;
  isGameSelected: boolean = false;


  @Input() isInvalid: boolean | undefined ;
  @Input() event: Event;

  constructor(private newEventFormService: NewEventFormService) { }

  ngOnInit(): void {
    this.newEventFormService.selectedGame$
    .pipe(
      filter(({ componentId }) => this.event ? componentId === this.event.id : componentId === 0),
      map(({ game }) => game),
      filter(game => !!game)
    )
    .subscribe(game => {
      this.selectedGame = game;
      this.options = game?.game.platforms || [];
      this.isGameSelected = !!game;


      if (this.event && this.event.platform) {
        const matchingPlatform = this.options.find(platform => platform.platform === this.event.platform);

        if (matchingPlatform) {
          this.selectPlatform(matchingPlatform);
        }
      } else {
        this.value = null;
      }

    });
  }

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
    this.value = platform.id;
    this.onChange(platform);
    this.onTouch();
  }
}
