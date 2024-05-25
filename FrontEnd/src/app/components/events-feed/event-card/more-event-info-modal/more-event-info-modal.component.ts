import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../../models/event';
import { UserService } from '../../../../services/user.service';
import { UserReduced } from '../../../../interfaces/user-reduced';
import { SocialUser } from '../../../../interfaces/social-user';
import { EventsService } from '../../../../services/events.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-more-event-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './more-event-info-modal.component.html',
  styleUrl: './more-event-info-modal.component.css'
})
export class MoreEventInfoModalComponent {
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
  join_LeaveLoading:boolean;

  @Output() isJoinedChange = new EventEmitter<boolean>();
  isJoined: boolean;

  @Output() friendsParticipatingChange = new EventEmitter<boolean>();
  friendsParticipating: boolean;

  constructor(private userService: UserService, private eventsService: EventsService) {
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

  joinEvent() {
    this.join_LeaveLoading = true;
    this.eventsService.joinEvent(this.event.id).subscribe(() => {
      this.toggleJoin();
      this.currentParticipants++;
      this.join_LeaveLoading = false;
    });
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
    this.userService.currentUser.subscribe(currentUser => {

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
}
