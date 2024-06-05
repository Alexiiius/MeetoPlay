import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Chat } from '../../interfaces/chat';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';
import { UserReduced } from '../../interfaces/user-reduced';
import { ChatMessage } from '../../interfaces/chat-message';

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

    this.chatsService.newChatCreated.subscribe((user: UserReduced) => {
      // Busca un chat existente con el usuario
      const existingChat = this.chats.find(chat => chat.user.id === user.id);

      // Si no se encuentra ninguno, crea un nuevo chat y añádelo a la lista de chats
      if (!existingChat) {
        const newChat: Chat = {
          from_user_id: this.logedUser.id,
          to_user_id: user.id,
          user: user,
          unreadMessagesCount: 0
        };
        this.chats.push(newChat);
      }
    });

    this.chatsService.getChats().subscribe((response: any) => {
      this.chats = response.data.conversations;

      const seenUsers: { [key: number]: boolean } = {}; // Add index signature to allow indexing with a number
      this.chats = this.chats.filter(chat => {
        if (seenUsers[chat.user.id]) {
          return false;
        } else {
          seenUsers[chat.user.id] = true;
          return true;
        }
      });

      // Inicializa unreadMessages a 0 para cada chat
      this.chats.forEach(chat => {
        chat.unreadMessagesCount = 0;
      });

      this.chatsService.getUnreadMessages().subscribe((response: any) => {
        const unreadMessages = response.data.unread_messages;

        unreadMessages.forEach((unreadMessage: ChatMessage) => {
          const chat = this.chats.find(chat => chat.user.id === unreadMessage.from_user_id);
          if (chat) {
            chat.unreadMessagesCount++;
          }
        });
      });
    });
  }
}
