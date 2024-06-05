import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Chat } from '../../interfaces/chat';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    ChatCardComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {

  chats: Chat[];
  logedUser: UserData;

  constructor(
    private chatsService: ChatsService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.logedUser = user;
      }
    });

    this.chatsService.getChats().subscribe((response: any) => {
      this.chats = response.data.conversations;
      console.log(this.chats);

      const seenUsers: { [key: number]: boolean } = {}; // Add index signature to allow indexing with a number
      this.chats = this.chats.filter(chat => {
        if (seenUsers[chat.user.id]) {
          return false;
        } else {
          seenUsers[chat.user.id] = true;
          return true;
        }
      });

      console.log(this.chats);


      // this.chats = this.chats.filter(chat => chat.from_user_id !== this.logedUser.id);
      // console.log(this.chats);
    });
  }
}
