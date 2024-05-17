import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../../models/event';
import { UserService } from '../../../../services/user.service';
import { UserReduced } from '../../../../interfaces/user-reduced';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.calculateEventDuration();

    this.eventParticipants = this.event.participants;
    console.log(this.eventParticipants);
  }

  calculateEventDuration() {
    const dateEnd = new Date(this.event.date_time_end);
    const dateBegin = new Date(this.event.date_time_begin);
    const diff = dateEnd.getTime() - dateBegin.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    this.eventDuration = `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
  }

  isJoined = false;

  toggleJoin() {
    this.isJoined = !this.isJoined;
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
