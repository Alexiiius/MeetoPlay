import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserReduced } from '../../interfaces/user-reduced';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/chats.service';
import { ChatMessage } from '../../interfaces/chat-message';
import { Messages } from '../../interfaces/messages';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  userData: UserReduced = JSON.parse(sessionStorage.getItem('user_data') || '{}');
  userId = this.userData?.id
  toUserId: number;

  chatPage: number = 1;
  chatTotalPages: number = 1;
  hasMorePages: boolean = true;

  message: string = '';

  messagesHistory: Messages;
  oldMessages: ChatMessage[] = [];

  gettingMessages: boolean = false;
  moreMessagesLoading: boolean = false;

  sendedMessages: { to_user_id: number; text: string; isLoading: boolean; }[] = [];

  constructor(
    private chatService: ChatsService,
    private webSocketService: WebSocketService) {
  }

  receivedMessages: string[] = [];

  ngOnInit() {
    this.webSocketService.setupEchoPublic();
    this.webSocketService.setupEchoPrivate();

    console.log('user id: ', this.userId);

    if (this.userId === 2) {
      this.toUserId = 3;
    } else {
      this.toUserId = 2;
    }

    this.getMessages(this.chatPage);
  }

  ngAfterViewInit() {
    this.messagesContainer.nativeElement.addEventListener('scroll', () => {
      if (this.messagesContainer.nativeElement.scrollTop === 0) {
        console.log('Reached top of the chat');
        this.loadMoreMessages();
      }
    });
  }

  getMessages(page: number, loadMore: boolean = false) {
    if (loadMore) {
      this.moreMessagesLoading = true;
    } else {
      this.gettingMessages = true;
    }

    this.chatService.getMessages(this.toUserId, page).subscribe(
      (response: any) => {
        this.messagesHistory = response.data.messages;
        this.oldMessages = [...this.messagesHistory.data.reverse(), ...this.oldMessages];
        this.chatTotalPages = this.messagesHistory.last_page;
        this.markMessagesAsRead();

        if (loadMore) {
          this.moreMessagesLoading = false;
        } else {
          this.gettingMessages = false;

          // Ajustar la posición del scroll
          setTimeout(() => {
            this.scrollToBottom();
          }, 0);
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadMoreMessages() {
    if (this.chatPage < this.chatTotalPages && !this.moreMessagesLoading) {
      console.log('Loading more messages');
      this.chatPage++;
      this.getMessages(this.chatPage, true);
    } else {
      this.hasMorePages = false;
    }
  }

  markMessagesAsRead() {
    const toMarkAsRead = this.oldMessages.filter(message => message.from_user_id === this.toUserId && !message.read_at).map(message => message.id);

    this.chatService.readMessages(toMarkAsRead).subscribe();
  }

  sendMessage() {
    const newMessage = {
      to_user_id: this.toUserId,
      text: this.message,
      isLoading: true
    };
    this.sendedMessages.push(newMessage);



    // Ajustar la posición del scroll
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    const text = this.message;
    this.message = '';

    this.chatService.sendMessage(this.toUserId, text).subscribe(
      (response) => {
        console.log(response);
        newMessage.isLoading = false;
      },
      (error) => {
        console.log(error);
        newMessage.isLoading = false;
      }
    );
  }

  scrollToBottom() {
    const messageContainer = document.getElementById('messagesContainer');
    if (messageContainer) {
      const lastMessage = messageContainer.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
