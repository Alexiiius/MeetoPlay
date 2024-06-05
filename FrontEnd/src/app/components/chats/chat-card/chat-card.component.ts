import { Component, Input } from '@angular/core';
import { UserReduced } from '../../../interfaces/user-reduced';
import { UserStatusComponent } from '../../profilecard/user-status/user-status.component';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    UserStatusComponent
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent {

  @Input() user: UserReduced

}
