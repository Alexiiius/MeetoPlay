import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../models/event';
import { format } from 'date-fns';
import { MoreEventInfoModalComponent } from './more-event-info-modal/more-event-info-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEventFormComponent } from '../../profile/edit-event-form/edit-event-form.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MoreEventInfoModalComponent,
    EditEventFormComponent
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent implements OnInit {
  // Simula la fecha y hora del final del evento
  isChecked = false;

  @Input() event: Event;
  @ViewChild('moreEventInfo') modalDialog!: ElementRef<HTMLDialogElement>;

  eventInscriptionEndTime: Date;
  formattedDateBegin: string;
  formattedTimeBegin: string;
  formattedDateEnd: string;
  formattedTimeEnd: string;

  isJoined: boolean;
  friendsParticipating: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.formattedDateBegin = format(this.event.date_time_begin, 'dd/MM/yyyy');
    this.formattedTimeBegin = format(this.event.date_time_begin, 'HH:mm');
    this.formattedDateEnd = format(this.event.date_time_end, 'dd/MM/yyyy');
    this.formattedTimeEnd = format(this.event.date_time_end, 'HH:mm');

    this.eventInscriptionEndTime = new Date(this.event.date_time_inscription_end);
  }

  isRoute(route: string): boolean {
    return this.router.url === route;
  }

  isActivatedRouteInChildRoute(routePath: string): boolean {
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    const routePathSegments = routePath.split('/').filter(segment => segment);

    if (routePathSegments.length > urlSegments.length) {
        return false;
    }

    for (let i = 0; i < routePathSegments.length; i++) {
        if (routePathSegments[i] !== urlSegments[i]) {
            return false;
        }
    }

    return true;
}

  @ViewChild('participatingBadge') participatingBadge: ElementRef;
  @ViewChild('friendsParticipatingBadge') friendsParticipatingBadge: ElementRef;

  hideParticipatingBadge() {
    this.participatingBadge.nativeElement.style.display = 'none';
  }

  hideFriendsParticipatingBadge() {
    this.friendsParticipatingBadge.nativeElement.style.display = 'none';
  }

  noRequirments() {
    return !this.event.event_requirements.min_rank &&
      !this.event.event_requirements.max_rank &&
      !this.event.event_requirements.min_level &&
      !this.event.event_requirements.max_level &&
      !this.event.event_requirements.min_hours_played &&
      !this.event.event_requirements.max_hours_played;
  }

  isJoinedChange(isJoined: boolean) {
    setTimeout(() => {
      this.isJoined = isJoined;
    }, 0);
  }

  FriendsParticipatingChange(friendsParticipating: boolean) {
    setTimeout(() => {
      this.friendsParticipating = friendsParticipating;
    }, 0);
  }

  openDialog() {
    this.modalDialog.nativeElement.showModal();
  }

  closeDialog() {
    this.modalDialog.nativeElement.close();
  }
}
