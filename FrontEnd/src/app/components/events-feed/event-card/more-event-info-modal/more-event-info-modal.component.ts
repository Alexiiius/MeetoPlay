import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../../models/event';
import { UserService } from '../../../../services/user.service';
import { UserReduced } from '../../../../interfaces/user-reduced';
import { SocialUser } from '../../../../interfaces/social-user';
import { EventsService } from '../../../../services/events.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { GameStat } from '../../../../interfaces/game-stat';
import { APIService } from '../../../../services/api.service';
import { ProfileService } from '../../../../services/profile.service';
import { AlertService } from '../../../../services/alert.service';
import { AlertComponent } from '../../../main/alert/alert.component';
import { set } from 'date-fns';


@Component({
  selector: 'app-more-event-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AlertComponent
  ],
  templateUrl: './more-event-info-modal.component.html',
  styleUrl: './more-event-info-modal.component.css'
})
export class MoreEventInfoModalComponent implements OnDestroy {
  @ViewChild('moreEventInfo') modalDialog!: ElementRef<HTMLDialogElement>;

  @Input() event: Event;
  @Input() eventInscriptionEndTime: Date;
  @Input() formattedDateBegin: string;
  @Input() formattedTimeBegin: string;
  @Input() formattedDateEnd: string;
  @Input() formattedTimeEnd: string;

  eventDuration: string;
  eventParticipants: UserReduced[]
  currentParticipants: number;

  followedUsers: SocialUser[];
  friends: SocialUser[];

  friendParticipants: UserReduced[] = [];
  followedParticipants: UserReduced[] = [];
  otherParticipants: UserReduced[] = [];
  logedUserParticipating: SocialUser;

  isParticipantsLoading: boolean;
  join_LeaveLoading: boolean;

  userGameStats: GameStat[];

  private currentUserSubscription: Subscription;

  @Output() isJoinedChange = new EventEmitter<boolean>();
  isJoined: boolean;

  @Output() friendsParticipatingChange = new EventEmitter<boolean>();
  friendsParticipating: boolean;

  constructor(
    private userService: UserService,
    private eventsService: EventsService,
    private apiService: APIService,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {
    setInterval(() => {
      this.decrementCountdown();
    }, 1000);
  }

  ngOnInit() {
    this.calculateEventDuration();
    this.eventParticipants = this.event.participants;
    this.currentParticipants = this.eventParticipants.length;
    this.filterParticipants();
  }

  async joinEvent() {
    this.join_LeaveLoading = true;

    const canJoin = await this.checkRequirements();

    if (!canJoin) {
      this.alertService.showAlert('warning', 'No cumples con los requisitos para unirte a este evento.');
      this.join_LeaveLoading = false;
      return;
    }

    this.eventsService.joinEvent(this.event.id).subscribe(() => {
      this.toggleJoin();
      this.alertService.showAlert('success', 'Te has unido al evento. ✨');
      this.currentParticipants++;
      this.join_LeaveLoading = false;
    });
  }

  async checkRequirements(): Promise<boolean> {

    const game = await this.apiService.newGetFullGame(this.event.game_id).toPromise();

    if (!game) {
      console.log('Game not found');
      return false;
    }

    const eventGamemode = game.gamemodes.find(gamemode => gamemode.name === this.event.game_mode);

    //Si no hay requisitos, se puede unir
    if (this.noRequirments()) {
      return true;
    }

    //Comprueba si el usuario tiene un GameStat registrado para el juego del evento
    const userGameStat = this.userGameStats.find(gameStat => gameStat.game_id == this.event.game_id);
    if (!userGameStat) {
      console.log('No game stats found');
      setTimeout(() => {
        this.alertService.showAlert('info', `No tienes un GameStat registado para ${this.event.game_name}.`)
      }, 4500);
      return false;
    } else {
      console.log('Game stats found');
    }

    //Comprueba si el usuario tiene un GamemodeStat registrado para el modo de juego del evento
    const gamemodeStats = userGameStat.gamemode_stats.find(gamemode => gamemode.gamemode_name == this.event.game_mode);
    if (!gamemodeStats) {
      setTimeout(() => {
        this.alertService.showAlert('info', `No tienes registrado el GamemodeStat de ${this.event.game_name} - ${this.event.game_mode}.`)
      }, 4500);
      return false;
    } else {
      console.log('Gamemode stats found');
    }

    const eventRequirements = this.event.event_requirements;

    // Si hay rango minimo, comprueba si el rango del usuario es mayor o igual al rango minimo requerido
    if (eventRequirements.min_rank) {

      if (!eventGamemode) {
        console.log('Gamemode not found');
        return false;
      }
      const gamemodeRanks = eventGamemode.ranks;

      const userRankIndex = gamemodeRanks.indexOf(gamemodeStats.gamemodes_rank);
      const minRankIndex = gamemodeRanks.indexOf(eventRequirements.min_rank);

      //Comprueba si el rango del usuario en ese modo de juego es mayor o igual al rango mínimo requerido para el evento
      if (userRankIndex < minRankIndex) {
        return false;
      }
    }

    //Si el modo de juego es no es ranked, el min_level y max_level se comparan con gamemodes_rank (dado que ahí se guarda el nivel)
    if (!eventGamemode?.ranked) {
      if ((eventRequirements.min_level && +gamemodeStats.gamemodes_rank < eventRequirements.min_level) ||
        (eventRequirements.max_level && +gamemodeStats.gamemodes_rank > eventRequirements.max_level)) {
        return false;
      }
    //Si no es ranked se comparará con el nivel de la cuenta
    } else {
      if ((eventRequirements.min_level && userGameStat.lv_account < eventRequirements.min_level) ||
        (eventRequirements.max_level && userGameStat.lv_account > eventRequirements.max_level)) {
        return false;
      }
    }

    //Comprueba si las horas jugadas del usuario están dentro del rango requerido
    if ((eventRequirements.min_hours_played && userGameStat.hours_played < eventRequirements.min_hours_played) ||
      (eventRequirements.max_hours_played && userGameStat.hours_played > eventRequirements.max_hours_played)) {
      return false;
    }

    return true;
  }

  leaveEvent() {
    this.join_LeaveLoading = true;
    this.eventsService.leaveEvent(this.event.id).subscribe(() => {
      this.toggleJoin();
      this.currentParticipants--;
      this.join_LeaveLoading = false;
    });
  }

  checkIfJoined() {
    this.userService.currentUser.subscribe(user => {
      this.isJoined = this.eventParticipants.some(participant => participant.id === user?.id);
      this.isJoinedChange.emit(this.isJoined);
    });
  }

  filterParticipants() {
    this.isParticipantsLoading = true;
    this.currentUserSubscription = this.userService.currentUser.subscribe(currentUser => {

      this.userService.followedUsers.subscribe(followedUsers => {
        this.followedUsers = followedUsers || [];

        this.userService.friends.subscribe(friends => {
          this.friends = friends || [];

          // Filtrar los participantes del evento
          this.friendParticipants = this.friends.length > 0 ? this.eventParticipants.filter(participant =>
            this.friends.some(friend => friend.id === participant.id) && participant.id !== currentUser?.id
          ) : [];

          this.followedParticipants = this.followedUsers.length > 0 ? this.eventParticipants.filter(participant =>
            this.followedUsers.some(followedUser => followedUser.id === participant.id) &&
            !this.friendParticipants.some(friendParticipant => friendParticipant.id === participant.id) &&
            participant.id !== currentUser?.id
          ) : [];

          this.otherParticipants = this.eventParticipants.filter(participant =>
            !this.followedUsers.some(followedUser => followedUser.id === participant.id) &&
            !this.friends.some(friend => friend.id === participant.id) &&
            participant.id !== currentUser?.id
          );

          this.checkIfJoined();

          this.isParticipantsLoading = false;
          this.checkIfFriendsParticipating();
        });
      });
    });
  }

  checkIfFriendsParticipating() {
    this.friendsParticipating = this.friendParticipants.length > 0;
    this.friendsParticipatingChange.emit(this.friendsParticipating);
  }

  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  decrementCountdown() {
    const now = new Date();
    const timeRemaining = this.eventInscriptionEndTime.getTime() - now.getTime();

    if (timeRemaining > 0) {
      const seconds = Math.floor((timeRemaining / 1000) % 60);
      const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

      this.countdown = { days, hours, minutes, seconds };
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  isEventInsciptionOpen() {
    const now = new Date();
    return now < this.eventInscriptionEndTime;
  }

  calculateEventDuration() {
    const dateEnd = new Date(this.event.date_time_end);
    const dateBegin = new Date(this.event.date_time_begin);
    const diff = dateEnd.getTime() - dateBegin.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    this.eventDuration = `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}`;
  }

  toggleJoin() {
    this.isJoined = !this.isJoined;
    this.isJoinedChange.emit(this.isJoined);
  }

  openDialog() {
    this.modalDialog.nativeElement.showModal();

    this.profileService.gameStats$.subscribe(gameStats => {
      this.userGameStats = gameStats;
      console.log(this.userGameStats);
      console.log(this.event)
    });
  }

  closeDialog() {
    this.modalDialog.nativeElement.close();
  }

  noRequirments() {
    return !this.event.event_requirements.min_rank &&
      !this.event.event_requirements.max_rank &&
      !this.event.event_requirements.min_level &&
      !this.event.event_requirements.max_level &&
      !this.event.event_requirements.min_hours_played &&
      !this.event.event_requirements.max_hours_played;
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }
}
