import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GamemodeStat } from '../../../../../interfaces/gamemode-stat';
import { UserService } from '../../../../../services/user.service';
import { ProfileService } from '../../../../../services/profile.service';

@Component({
  selector: 'tr[app-gamemode-stats]',
  standalone: true,
  imports: [],
  templateUrl: './gamemode-stats.component.html',
  styleUrl: './gamemode-stats.component.css'
})
export class GamemodeStatsComponent {

  @Input() gamemodeStat: GamemodeStat;
  @Input() isLoading: boolean;
  @Output() gamemodeStatEditing = new EventEmitter<GamemodeStat>();

  userService = inject(UserService);
  profileService = inject(ProfileService);

  deletingGameStat: boolean = false;

  editGamemodeStat() {
    this.gamemodeStatEditing.emit(this.gamemodeStat);
  }

  deleteGamemodeStat(gamemodeStatId: number) {
    this.deletingGameStat = true;
    this.userService.deleteGamemodeStat(gamemodeStatId).subscribe(() => {
      this.profileService.gamemodeStatDeleted.next(gamemodeStatId);
      this.deletingGameStat = false;
    });
  }
}
