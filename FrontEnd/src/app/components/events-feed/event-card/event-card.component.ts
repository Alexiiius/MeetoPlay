import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class EventCardComponent {
  eventEndTime = new Date('2024-05-31T23:59:59'); // Simula la fecha y hora del final del evento
  isChecked = false;

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

  decrementCountdown() {
    const now = new Date();
    const timeRemaining = this.eventEndTime.getTime() - now.getTime();

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
}
