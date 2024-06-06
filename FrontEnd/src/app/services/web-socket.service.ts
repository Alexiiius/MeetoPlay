import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { backAPIUrl } from '../config';
import { SocketMessage } from '../interfaces/socket-message';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  backAPIUrl: string = backAPIUrl;

  token: string = localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';

  private Echo: Echo;
  private Pusher: typeof Pusher;

  private messageSource = new Subject<SocketMessage>();
  message$ = this.messageSource.asObservable();

  constructor() {
    this.Pusher = Pusher;
  }


  setupEchoPublic() {

    this.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'ixyw7gpei8mjty0vi0n5',
      wsHost: '35.173.106.192',
      wsPort: 8085,
      wssPort: 8085,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
    });

    this.Echo.channel(`public`).listen('GlobalMessage', (e: any) => {
      console.log("From public channel");
      console.log(e);
    });
  }

  setupEchoPrivate(userId: number) {
    this.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'ixyw7gpei8mjty0vi0n5',
      wsHost: '35.173.106.192',
      wsPort: 8085,
      wssPort: 8085,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
            'Authorization': 'Bearer ' + this.token,
        },
    },
    authEndpoint: `http://35.173.106.192:80/api/broadcasting/auth`
    });


    this.Echo.private(`App.Models.User.${userId}`).listen('GotMessage', (response: any) => {
      console.log("From private channel");
      console.log(response);
      this.messageSource.next(response.message);
    });
  }

}
