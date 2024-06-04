import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { backAPIUrl } from '../config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  backAPIUrl: string = backAPIUrl;

  token: string = localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';

  private Echo: Echo;
  private Pusher: typeof Pusher;

  constructor(@Inject(DOCUMENT) private document: Document) {
    // this.setupEchoPublic();
    // this.setupEchoPrivate();

    this.Pusher = Pusher;
  }
  setupEchoPublic() {

    this.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'ixyw7gpei8mjty0vi0n5',
      wsHost: 'localhost',
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
    });

    this.Echo.channel(`public`).listen('GlobalMessage', (e: any) => {
      console.log("From public channel");
      console.log(e);
    });
  }

  setupEchoPrivate() {
    this.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'ixyw7gpei8mjty0vi0n5',
      wsHost: 'localhost',
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
            'Authorization': 'Bearer ' + 'mFpSVUmgbhSnm2RDuNz3JzIsEMPCxpsTox1E7fjqbd11e402',
        },
    },
    authEndpoint: `http://localhost:80/api/broadcasting/auth`
    });


    this.Echo.private(`App.Models.User.2`).listen('GotMessage', (e: any) => {
      console.log("From private channel");
      console.log(e);
    });
  }

}
