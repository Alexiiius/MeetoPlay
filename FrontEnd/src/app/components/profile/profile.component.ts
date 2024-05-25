import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';
import { CommonModule } from '@angular/common';

import { SocialsComponent } from './socials/socials.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    SocialsComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: UserData; //TODO create userComplete interface
  isLoading = true;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

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

  checkRoute() {
    const url = this.router.url; // obtiene la URL actual
    const pattern = /^\/main\/profile\/[^\/]+\/gameStats$/; // patrón para verificar la URL

    return pattern.test(url); // devuelve true si la URL coincide con el patrón, false en caso contrario
  }
}
