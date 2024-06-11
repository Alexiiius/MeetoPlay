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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-global-chat',
  standalone: true,
  imports: [
    FormsModule,
    PickerComponent,
    DatePipe
  ],
  templateUrl: './global-chat.component.html',
  styleUrl: './global-chat.component.css',
})
export class GlobalChatComponent implements OnInit {

  lastMessages: SocketPublicMessage[] = [];
  LiveMessages: LivePublicMessage[] = [];
  message: string = ''
  logedUser: UserData;
  showEmojis: boolean = false;
  lastMessagesLoading: boolean = true;
  items = Array(20).fill(0);

  private userColors: { [username: string]: string } = {};
  private tailwindColors = ['text-red-300', 'text-yellow-300', 'text-green-300', 'text-blue-300', 'text-indigo-300', 'text-purple-300', 'text-pink-300', 'text-orange-300', 'text-amber-300', 'text-lime-300', 'text-emerald-300', 'text-teal-300', 'text-cyan-300', 'text-sky-300',];

  constructor(
    private webSocketService: WebSocketService,
    private chatService: ChatsService,
    private userService: UserService,
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
      if (!element) return;

      this.lastMessages.forEach(message => {
        message.color = this.getColorForUser(message.from_user_name);
      });

      this.lastMessagesLoading = false;

      // Crear un MutationObserver para observar los cambios en el contenedor de mensajes
      const observer = new MutationObserver(() => {
        // Ajustar la posición del scroll cuando se detecte un cambio
        element.scrollTop = element.scrollHeight;
      });

      // Iniciar la observación
      observer.observe(element, { childList: true });

      // Detener la observación después de un tiempo
      setTimeout(() => {
        observer.disconnect();
      }, 1000); // Ajusta este valor según sea necesario
    });
  }

  onNewPublicMessage(message: SocketMessage) {
    if(message.from_user_id === this.logedUser.id) return;

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

  toggleEmojis() {
    this.showEmojis = !this.showEmojis;
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
