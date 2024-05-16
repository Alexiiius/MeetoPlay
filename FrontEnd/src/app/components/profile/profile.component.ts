import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';
import { CommonModule } from '@angular/common';

import { SocialsComponent } from './socials/socials.component';
import { GameStatCardComponent } from './game-stat-card/game-stat-card.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    SocialsComponent,
    GameStatCardComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: UserData; //TODO create userComplete interface
  isLoading = true;

  constructor(private route: ActivatedRoute, private userService: UserService) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getUserById(params['id']).subscribe(user => {
        this.user = user;
        this.isLoading = false;
      });
    });
  }

  isOverflow(element: any) {
    return element.scrollWidth > element.clientWidth;
}
}
