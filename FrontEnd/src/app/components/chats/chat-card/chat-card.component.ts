import { Component, Input, OnInit } from '@angular/core';
import { UserReduced } from '../../../interfaces/user-reduced';
import { UserStatusComponent } from '../../profilecard/user-status/user-status.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ChatsService } from '../../../services/chats.service';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    UserStatusComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent implements OnInit{

  @Input() user: UserReduced
  @Input() unreadedMessages: number;

  constructor(
    private router: Router,
    private chatsService: ChatsService) { }

  ngOnInit(): void {
      if (this.user) {
        this.user.full_tag = this.user.name + this.user.tag
      }

    if (this.unreadedMessages >= 20) {
      this.unreadedMessages = 20;
    }
  }

  navigateToChatWithUser(user: UserReduced) {
    this.chatsService.setUser(user);
    //Elimina los espacios del fulltag
    if (user.full_tag){
      user.full_tag = user.full_tag.replace(/\s/g, '');
    }

    this.router.navigate(['/chat-with', user.full_tag]);
  }
}
