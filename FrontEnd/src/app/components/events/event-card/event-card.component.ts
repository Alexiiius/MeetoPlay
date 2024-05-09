import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  isExpanded = true;

  toggleCard() {
    this.isExpanded = !this.isExpanded;
  }
}
