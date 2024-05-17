import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
}
