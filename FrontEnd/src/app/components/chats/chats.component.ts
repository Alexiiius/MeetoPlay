import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Chat } from '../../interfaces/chat';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { UserData } from '../../interfaces/user-data';
import { UserService } from '../../services/user.service';
import { UserReduced } from '../../interfaces/user-reduced';
import { ChatMessage } from '../../interfaces/chat-message';
import { WebSocketService } from '../../services/web-socket.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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

  chats: Chat[] = [];
  logedUser: UserData;

  userIdChatOpen: number;

  constructor(
    private chatsService: ChatsService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.logedUser = user;
        this.webSocketService.setupEchoPrivate(user.id)
      }
    });

    this.onChatsLeave();

    this.userIdChatOpen = this.chatsService.getUser().id;

    this.webSocketService.privateMessage$.subscribe(message => {
      // Añade el mensaje a la conversación correspondiente
      this.addUnreadedMessagesLive(message);

      // Muestra una notificación
      this.notification(message);
    });


    this.chatsService.newChatCreated.subscribe((user: UserReduced) => {
      this.onNewChatCreated(user);
    });


    this.chatsService.getChats().subscribe((response: any) => {
      this.chats = response.data.conversations;

      this.deleteDuplicatedChats();
      this.addUnreadedMessages();
      this.updateUserChatingWithStatus();

      this.chats.forEach((chat) => {
        const openChatId = Number(sessionStorage.getItem('open_chat_id'));
        chat.open = chat.user.id === openChatId;
      });
    });
  }


  addUnreadedMessagesLive(message: any) {
    const chat = this.chats.find(chat => chat.user.id === message.from_user_id);

    if (!chat) {
      this.userService.getUserById(message.from_user_id).subscribe((user: UserData) => {

        const userReduced: UserReduced = {
          id: user.id,
          name: user.name,
          tag: user.tag,
          full_tag: `${user.name}#${user.tag}`,
          avatar: user.avatar,
          status: user.status
        };

        this.onNewChatCreated(userReduced, true);

      });

    } else if (this.userIdChatOpen !== message.from_user_id) {
      chat.unreadMessagesCount++;
    }
  }

  notification(message: any) {
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
      // Ask the user for permission to show notifications, if necessary
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }

      // If the user has granted permission, show a notification
      if (Notification.permission === "granted") {
        new Notification(`Nuevo mensaje de ${message.from_user_name}`, {
          body: message.text,
          icon: "../../../assets/favicon.svg"
        });
      }
    }
  }

  onNewChatCreated(user: UserReduced, withNewMessage = false) {
    // Busca un chat existente con el usuario
    const existingChat = this.chats.find(chat => chat.user.id === user.id);

    // Si no se encuentra ninguno, crea un nuevo chat y añádelo a la lista de chats
    if (!existingChat) {
      const newChat: Chat = {
        from_user_id: this.logedUser.id,
        to_user_id: user.id,
        user: user,
        unreadMessagesCount: withNewMessage ? 1 : 0,
        open: true
      };

      this.chats.push(newChat);
      this.navigateToChatWithUser(newChat);
    } else {
      // Si se encuentra, abre el chat
      this.navigateToChatWithUser(existingChat);
    }
  }

  deleteDuplicatedChats() {

    const seenUsers: { [key: number]: boolean } = {};
    this.chats = this.chats.filter(chat => {
      if (seenUsers[chat.user.id]) {
        return false;
      } else {
        seenUsers[chat.user.id] = true;
        return true;
      }
    });
  }

  addUnreadedMessages() {
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
  }

  onChatOpen(chat: Chat) {
    chat.unreadMessagesCount = 0;
  }

  navigateToChatWithUser(chat: Chat) {
    this.chatsService.setUser(chat.user);

    //Elimina los espacios del fulltag
    if (chat.user.full_tag) {
      chat.user.full_tag = chat.user.full_tag.replace(/\s/g, '');
    }

    this.userIdChatOpen = chat.user.id;
    chat.unreadMessagesCount = 0;

    // Recorro todos los chats para cerrarlos
    this.chats.forEach((chat) => {
      chat.open = false;
    });

    chat.open = true;

    // Guardo el ID del chat abierto en sessionStorage
    sessionStorage.setItem('open_chat_id', chat.user.id.toString());

    this.router.navigate(['/chat-with', chat.user.full_tag]);
  }

  updateUserChatingWithStatus() {
    const userChattingWith = this.chatsService.getUser();
    const updatedUserChattingWith = this.chats.find(chat => chat.user.id === userChattingWith.id)?.user;

    if (updatedUserChattingWith) {
      this.chatsService.setUser(updatedUserChattingWith);
      this.chatsService.userChattingWithUpdated.next();
    }
  }

  onChatsLeave() {
    // Suscribirse a los eventos de cambio de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (!event.url.startsWith('/chat-with')) {
          // Si la nueva ruta no comienza con '/chat-with', cerrar todos los chats
          this.chats.forEach(chat => {
            chat.open = false;
          });
          // También borra el chat abierto de sessionStorage
          sessionStorage.removeItem('open_chat_id');
        }
      }
    });
  }
}
