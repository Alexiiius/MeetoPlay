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

  private publicMessageSource = new Subject<SocketMessage>();
  publicMessage$ = this.publicMessageSource.asObservable();

  private privateMessageSource = new Subject<SocketMessage>();
  privateMessage$ = this.privateMessageSource.asObservable();

  private privateMessagesChannel: string;

  private publicDone: boolean = false;
  private privateDone: boolean = false;


  constructor() {
    this.Pusher = Pusher;
  }


  setupEchoPublic() {
    if (this.publicDone) return;

    this.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'ixyw7gpei8mjty0vi0n5',
      wsHost: 'meetoplay.duckdns.org',
      wsPort: 8085,
      wssPort: 443,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
    });

    this.Echo.channel(`public`).listen('GlobalMessage', (response: any) => {
      console.log("From public channel");
      console.log(response);

      this.publicMessageSource.next(response.message);
    });
  }

  setupEchoPrivate(userId: number) {

    if (this.privateDone) return;

    this.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'ixyw7gpei8mjty0vi0n5',
      wsHost: 'meetoplay.duckdns.org',
      wsPort: 8085,
      wssPort: 443,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
          'Authorization': 'Bearer ' + this.token,
        },
      },
      authEndpoint: `https://meetoplay.duckdns.org/api/broadcasting/auth`
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
