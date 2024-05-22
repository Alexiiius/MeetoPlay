import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../../../models/game';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [],
  template: `
  <div class="flex items-center space-x-3 p-2 hover:bg-base-300 cursor-pointer" (click)="select()">
    <img [src]="game.image" class="w-8 h-8">
    <span>{{ game.name }}</span>
  </div>
`,
})
export class OptionComponent {
  @Input() game: Game;
  @Output() optionSelected = new EventEmitter<Game>();

  select() {
    console.log('Option selected', this.game);
    this.optionSelected.emit(this.game);
  }
}
