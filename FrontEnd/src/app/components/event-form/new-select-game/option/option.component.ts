import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../../../models/game';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
  <div class="flex items-center space-x-3 p-2" [ngClass]="{'hover:bg-base-300 cursor-pointer': game.id !== -2}" (click)="select()">
  @if (this.isLoading) {
    <span class="loading loading-spinner text-primary"></span>
  } @else {
    <img [src]="game.image" class="w-7 h-7">
  }
    <span>{{ game.name }}</span>
  </div>
`,
})
export class OptionComponent {
  @Input() game: Game;
  @Input() isLoading: boolean;
  @Output() optionSelected = new EventEmitter<Game>();

  select() {
    this.optionSelected.emit(this.game);
  }
}
