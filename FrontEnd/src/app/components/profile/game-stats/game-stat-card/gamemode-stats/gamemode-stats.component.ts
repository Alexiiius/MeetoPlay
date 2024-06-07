import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GamemodeStat } from '../../../../../interfaces/gamemode-stat';
import { UserService } from '../../../../../services/user.service';
import { ProfileService } from '../../../../../services/profile.service';
import { UserData } from '../../../../../interfaces/user-data';

@Component({
  selector: 'tr[app-gamemode-stats]',
  standalone: true,
  imports: [],
  templateUrl: './gamemode-stats.component.html',
  styleUrl: './gamemode-stats.component.css'
})
export class GamemodeStatsComponent implements OnInit {

  @Input() gamemodeStat: GamemodeStat;
  @Input() isLoading: boolean;
  @Output() gamemodeStatEditing = new EventEmitter<GamemodeStat>();

  userService = inject(UserService);
  profileService = inject(ProfileService);

  logedUser: UserData;
  profileId: number | null = null;

  deletingGameStat: boolean = false;

  constructor() { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.logedUser = user;
      }
    });

    this.profileService.getUserProfileId().subscribe(id => {
      this.profileId = id;
    });
  }

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
