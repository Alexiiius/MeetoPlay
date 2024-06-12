import { Injectable } from '@angular/core';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { UserReduced } from '../interfaces/user-reduced';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private chatWithUser: UserReduced;

  newChatCreated = new Subject<UserReduced>()
  userChattingWithUpdated = new Subject<void>()
  lastUserChattingWithId = new Subject<number>();

  setUser(user: UserReduced) {
    this.chatWithUser = user;
    sessionStorage.setItem('user_chating_with', JSON.stringify(user));
  }

  getUser(): UserReduced {
    if (!this.chatWithUser) {
      this.chatWithUser = JSON.parse(sessionStorage.getItem('user_chating_with') || '{}');
    }
    return this.chatWithUser;
  }

  backAPIUrl = backAPIUrl;

  constructor(private http: HttpClient) { }

  sendMessage(toUserId: number, message: string) {
    return this.http.post(`${this.backAPIUrl}/message/send`, {
      to_user_id: toUserId,
      text: message
    })
  }

  getMessages(toUserId: number, page: number) {
    return this.http.get(`${this.backAPIUrl}/message/get/${toUserId}/${page}`);
  }

  readMessages(toMarkAsRead: number[]) {
    return this.http.put(`${this.backAPIUrl}/message/read`, { message_ID: toMarkAsRead });
  }

  getChats() {
    return this.http.get(`${this.backAPIUrl}/message/get/conversations`);
  }

  getUnreadMessages() {
    return this.http.get(`${this.backAPIUrl}/message/get/unread`);
  }

  getLastGlobalMessages() {
    return this.http.get(`${this.backAPIUrl}/message/get/global`);
  }

  sendPublicMessage(message: string) {
    return this.http.post(`${this.backAPIUrl}/message/send`, {
      to_user_id: 1,
      text: message,
      group_name: "global"
    })
  }
}
