import { Component, ViewChild } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { UsersSearcherComponent } from './users-searcher/users-searcher.component';
import { GlobalChatComponent } from './global-chat/global-chat.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    UsersSearcherComponent,
    EventFormComponent,
    GlobalChatComponent,
    PickerComponent
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

  @ViewChild(EventFormComponent) eventFormComponent!: EventFormComponent;

  openNewEventModal() {
    this.eventFormComponent.openModal()
  }
}
