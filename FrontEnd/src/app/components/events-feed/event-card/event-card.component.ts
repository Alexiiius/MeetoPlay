import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../models/event';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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


  ngOnInit() {
    this.formattedDateBegin = format(this.event.date_time_begin, 'dd/MM/yyyy');
    this.formattedTimeBegin = format(this.event.date_time_begin, 'HH:mm');
    this.formattedDateEnd = format(this.event.date_time_end, 'dd/MM/yyyy');
    this.formattedTimeEnd = format(this.event.date_time_end, 'HH:mm');

    this.eventInscriptionEndTime = new Date(this.event.date_time_inscription_end);
  }

  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  constructor() {
    setInterval(() => {
      this.decrementCountdown();
    }, 1000);

  }

  noRequirments() {
    return !this.event.event_requirements.min_rank &&
      !this.event.event_requirements.max_rank &&
      !this.event.event_requirements.min_level &&
      !this.event.event_requirements.max_level &&
      !this.event.event_requirements.min_hours_played &&
      !this.event.event_requirements.max_hours_played;
  }

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

  openDialog() {
    this.modalDialog.nativeElement.showModal();
  }

  closeDialog() {
    this.modalDialog.nativeElement.close();
  }
}
