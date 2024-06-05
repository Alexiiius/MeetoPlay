import { Injectable } from '@angular/core';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatsService {


  backAPIUrl = backAPIUrl;

  constructor(private http: HttpClient) {}

  sendMessage(toUserId: number, message: string) {
    console.log('toUserId: ', toUserId);
    console.log('message: ', message);
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

  getChats(){
    return this.http.get(`${this.backAPIUrl}/message/get/conversations`);
  }
}
