import { Component, Input, OnInit } from '@angular/core';
import { UserReduced } from '../../../interfaces/user-reduced';
import { UserStatusComponent } from '../../profilecard/user-status/user-status.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Chat } from '../../../interfaces/chat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    UserStatusComponent,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent implements OnInit{

  user: UserReduced;
  @Input() chat: Chat;

  constructor() { }

  ngOnInit(): void {
    this.user = this.chat.user;

      if (this.user) {
        this.user.full_tag = this.user.name + this.user.tag
      }
  }
}
