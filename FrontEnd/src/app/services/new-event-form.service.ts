import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Gamemode } from '../models/gamemode';
import { FullGame } from '../models/fullgame';

@Injectable({
  providedIn: 'root'
})
export class NewEventFormService {

  // private selectedGameSource = new BehaviorSubject<FullGame | null>(null);
  // selectedGame$ = this.selectedGameSource.asObservable();

  private selectedGames: { [componentId: number]: FullGame | null } = {};
  private selectedGameSubject = new Subject<{ componentId: number, game: FullGame | null }>();
  selectedGame$ = this.selectedGameSubject.asObservable();

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

  // changeSelectedGame(game: FullGame | null) {
  //   this.selectedGameSource.next(game);
  //   console.log('Game changed to: ' + game?.game.name);
  // }

  changeSelectedGame(componentId: number, game: FullGame | null) {
    this.selectedGames[componentId] = game;
    this.selectedGameSubject.next({ componentId, game });
  }

  getSelectedGame(componentId: number): FullGame | null {
    return this.selectedGames[componentId];
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
