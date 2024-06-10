import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../../services/web-socket.service';
import { SocketMessage } from '../../../interfaces/socket-message';
import { ChatsService } from '../../../services/chats.service';
import { FormsModule } from '@angular/forms';
import { SocketPublicMessage } from '../../../interfaces/socket-public-message';
import { LivePublicMessage } from '../../../interfaces/live-public-message';
import { UserData } from '../../../interfaces/user-data';
import { UserService } from '../../../services/user.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-global-chat',
  standalone: true,
  imports: [
    FormsModule,
    PickerComponent
  ],
  templateUrl: './global-chat.component.html',
  styleUrl: './global-chat.component.css'
})
export class GlobalChatComponent implements OnInit {

  lastMessages: SocketPublicMessage[] = [];
  LiveMessages: LivePublicMessage[] = [];
  message: string = ''
  logedUser: UserData;

  private userColors: { [username: string]: string } = {};
  private tailwindColors = ['text-red-200', 'text-yellow-200', 'text-green-200', 'text-blue-200', 'text-indigo-200', 'text-purple-200', 'text-pink-200', 'text-orange-200', 'text-amber-200', 'text-lime-200', 'text-emerald-200', 'text-teal-200', 'text-cyan-200', 'text-sky-200',];

  constructor(
    private webSocketService: WebSocketService,
    private chatService: ChatsService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.webSocketService.setupEchoPublic();
    this.getLastGlobalMessages();

    this.webSocketService.publicMessage$.subscribe((message) => {
      this.onNewPublicMessage(message);
    });

    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.logedUser = user;
      }
    });
  }

  getLastGlobalMessages() {
    this.chatService.getLastGlobalMessages().subscribe((response: any) => {
      this.lastMessages = response.data.messages.reverse();

      const element = document.getElementById('publicMessagesContainer');
      let oldScrollPosition = 0;
      let oldScrollHeight = 0;
      if (element) {
        oldScrollPosition = element.scrollTop;
        oldScrollHeight = element.scrollHeight;
      }

      // Ajustar la posición del scroll
      setTimeout(() => {
        if (element) {
          const newScrollHeight = element.scrollHeight;
          element.scrollTop = oldScrollPosition + (newScrollHeight - oldScrollHeight);
        }
      }, 0);


      this.lastMessages.forEach(message => {
        message.color = this.getColorForUser(message.from_user_name);
      });
    });
  }

  onNewPublicMessage(message: SocketMessage) {
    console.log('New public message', message);

    const newMessage: LivePublicMessage = {
      from_user_id: message.from_user_id,
      from_user_name: message.from_user_name,
      text: message.text,
      created_at: new Date().toISOString(),
      color: this.getColorForUser(message.from_user_name)
    };

    const element = document.getElementById('publicMessagesContainer');
    let isUserAtBottom = false;
    if (element) {
      const scrollPosition = element.scrollTop;
      const elementSize = element.clientHeight;
      const contentHeight = element.scrollHeight;

      // Check if user is at the bottom
      isUserAtBottom = Math.ceil(elementSize + scrollPosition) >= contentHeight;
    }

    if (isUserAtBottom) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }

    this.LiveMessages.push(newMessage);
  }

  sendMessage() {
    if (this.message.trim() === '') {
      return;
    }

    const newMessage: LivePublicMessage = {
      from_user_id: this.logedUser.id,
      from_user_name: `${this.logedUser.name}#${this.logedUser.tag}`,
      text: this.message,
      created_at: new Date().toISOString(),
      color: this.getColorForUser(`${this.logedUser.name}#${this.logedUser.tag}`)
    };

    this.LiveMessages.push(newMessage);

    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    const text = this.message;
    this.message = '';

    this.chatService.sendPublicMessage(text).subscribe((response: any) => {
      console.log('Message sent', response);
    });
  }

  private getColorForUser(username: string) {
    if (!this.userColors[username]) {
      this.userColors[username] = this.getRandomColor();
    }
    return this.userColors[username];
  }

  private getRandomColor() {
    const randomIndex = Math.floor(Math.random() * this.tailwindColors.length);
    return this.tailwindColors[randomIndex];
  }

  scrollToBottom() {
    const messageContainer = document.getElementById('publicMessagesContainer');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  addEmoji(event: any) {
    this.message += event.emoji.native;
  }
}
