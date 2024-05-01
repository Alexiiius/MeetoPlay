import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class NewEventFormService {
  private selectedGameSource = new BehaviorSubject<Game | null>(null);
  selectedGame$ = this.selectedGameSource.asObservable();

  constructor() { }

  changeSelectedGame(game: Game | null) {
    this.selectedGameSource.next(game);
  }
}
