import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { backAPIUrl } from '../config';
import { SocketMessage } from '../interfaces/socket-message';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  backAPIUrl: string = backAPIUrl;

  token: string = localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';

  private Echo: Echo;
  private Pusher: typeof Pusher;

  private privateMessageSource = new Subject<SocketMessage>();
  privateMessage$ = this.privateMessageSource.asObservable();

  private privateMessagesChannel: string;

  private privateDone: boolean = false;

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

    if (!this.privateDone) {
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


      this.privateMessagesChannel = `App.Models.User.${userId}`;

      this.Echo.private(this.privateMessagesChannel).listen('GotMessage', (response: any) => {
        console.log("From private channel");
        console.log(response);

        this.privateMessageSource.next(response.message);
      });

      this.privateDone = true;
    }
  }

}
