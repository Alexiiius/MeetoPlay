import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserReduced } from '../../interfaces/user-reduced';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/chats.service';
import { ChatMessage } from '../../interfaces/chat-message';
import { Messages } from '../../interfaces/messages';
import { WebSocketService } from '../../services/web-socket.service';
import { format } from 'date-fns';
import { LiveMessage } from '../../interfaces/live-message';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollButton') scrollButton: ElementRef;
  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  showScrollButton = false;

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

  liveMessages: LiveMessage[] = [];

  groupedMessages: { [key: string]: ChatMessage[] } = {};

  constructor(
    private chatService: ChatsService,
    private webSocketService: WebSocketService,
    private renderer: Renderer2,
    private el: ElementRef,
    private userService: UserService) {
  }

  ngOnInit() {
    this.webSocketService.setupEchoPublic();
    this.userService.currentUser.subscribe(user => {
      if (user) {
        this.webSocketService.setupEchoPrivate(user.id);
      }
    });

    this.webSocketService.message$.subscribe(message => {
      console.log("Received new message", message);
      const formatedMessage = {
        to_user_id: message.to_user_id,
        text: message.text,
        isLoading: false,
        created_at: new Date().toISOString()
      };

      const element = document.getElementById('messagesContainer');
      let isUserAtBottom = false;
      if (element) {
        const scrollPosition = element.scrollTop;
        const elementSize = element.clientHeight;
        const contentHeight = element.scrollHeight;

        // Check if user is at the bottom
        isUserAtBottom = Math.ceil(elementSize + scrollPosition) >= contentHeight;
      }

      this.liveMessages.push(formatedMessage);

      if (isUserAtBottom) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      }
    });

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
        this.loadMoreMessages();
      }

      // Show or hide the scroll button
      const element = this.messagesContainer.nativeElement;
      const scrollBottom = element.scrollHeight - element.clientHeight;
      this.showScrollButton = element.scrollTop < scrollBottom - 300; // Change this to the scroll distance you want
    });

    this.renderer.listen('window', 'scroll', () => {
      const headers = this.el.nativeElement.querySelectorAll('.date-header');
      headers.forEach((header: HTMLElement, i: number) => {
        if (i < headers.length - 1 && headers[i + 1].getBoundingClientRect().top <= header.offsetHeight) {
          this.renderer.setStyle(header, 'top', `-${header.offsetHeight}px`);
        } else {
          this.renderer.setStyle(header, 'top', '0');
        }
      });
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

        const element = document.getElementById('messagesContainer');
        let oldScrollPosition = 0;
        let oldScrollHeight = 0;
        if (element) {
          oldScrollPosition = element.scrollTop;
          oldScrollHeight = element.scrollHeight;
        }

        this.oldMessages = [...this.messagesHistory.data.reverse(), ...this.oldMessages];
        this.processMessages();
        this.chatTotalPages = this.messagesHistory.last_page;
        this.markMessagesAsRead();

        if (loadMore) {
          this.moreMessagesLoading = false;
        } else {
          this.gettingMessages = false;
        }

        // Ajustar la posición del scroll
        setTimeout(() => {
          if (element) {
            const newScrollHeight = element.scrollHeight;
            element.scrollTop = oldScrollPosition + (newScrollHeight - oldScrollHeight);
          }
        }, 0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  processMessages() {
    this.groupedMessages = this.oldMessages.reduce((groups: { [key: string]: ChatMessage[] }, message) => {
      const date = new Date(message.created_at);
      const today = new Date();
      let dateKey;

      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Hoy';
      } else if (date.getDate() === today.getDate() - 1) {
        dateKey = 'Ayer';
      } else {
        dateKey = date.toLocaleDateString();
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);

      return groups;
    }, {});
    console.log(this.groupedMessages);
  }

  loadMoreMessages() {
    if (this.chatPage < this.chatTotalPages && !this.moreMessagesLoading) {
      console.log('Loading more messages');
      this.chatPage++;
      this.getMessages(this.chatPage, true);
    } else if (!this.moreMessagesLoading) {
      this.hasMorePages = false;
    }
  }

  markMessagesAsRead() {
    const toMarkAsRead = this.oldMessages.filter(message => message.from_user_id === this.toUserId && !message.read_at).map(message => message.id);

    this.chatService.readMessages(toMarkAsRead).subscribe();
  }

  sendMessage() {
    if (this.message.trim() === '') {
      return;
    }

    const newMessage = {
      to_user_id: this.toUserId,
      text: this.message,
      isLoading: true,
      created_at: new Date().toISOString()
    };
    this.liveMessages.push(newMessage);

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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  }
}
