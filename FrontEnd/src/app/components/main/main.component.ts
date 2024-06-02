import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from '../chats/chats.component';
import { EventsFeedComponent } from '../events-feed/events.component';
import { ProfilecardComponent } from '../profilecard/profilecard.component';
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from './alert/alert.component';
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatsComponent,
    EventsFeedComponent,
    ProfilecardComponent,
    HttpClientModule,
    AlertComponent,
    AsideComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  constructor(
    private authService: AuthService,

  ) { }

  ngOnInit() {
    this.authService.getUserData().subscribe();
  }
}
