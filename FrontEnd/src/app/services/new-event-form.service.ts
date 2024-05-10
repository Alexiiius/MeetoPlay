import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/game';
import { Gamemode } from '../models/gamemode';

@Injectable({
  providedIn: 'root'
})
export class NewEventFormService {

  private selectedGameSource = new BehaviorSubject<Game | null>(null);
  selectedGame$ = this.selectedGameSource.asObservable();

  private selectedGamemodeSource = new BehaviorSubject<Gamemode | null>(null);
  selectedGamemode$ = this.selectedGamemodeSource.asObservable();

  private rankedSource = new BehaviorSubject<boolean>(false);
  ranked$ = this.rankedSource.asObservable();

  private whoFormSubmittedSource = new BehaviorSubject<boolean>(false);
  whoFormSubmitted$ = this.whoFormSubmittedSource.asObservable();

  private toggleInscriptionSource = new BehaviorSubject<boolean>(false);
  toggleInscription$ = this.toggleInscriptionSource.asObservable();

  constructor() {
  }

  changeSelectedGame(game: Game | null) {
    this.selectedGameSource.next(game);
  }

  changeSelectedGameMode(gamemode: Gamemode | null) {
    this.selectedGamemodeSource.next(gamemode);
  }

  updateRanked(value: boolean) {
    this.rankedSource.next(value);
  }

  setToggleInscription(value: boolean) {
    this.toggleInscriptionSource.next(value);
  }

  submitWhoForm() {
    this.whoFormSubmittedSource.next(true);
  }
}
