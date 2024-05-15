import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserData } from '../../../interfaces/user-data';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserStatusComponent } from '../../user-status/user-status.component';

@Component({
  selector: 'app-extra',
  standalone: true,
  imports: [
    CommonModule,
    UserStatusComponent,
    RouterLink
  ],
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.css']
})
export class ExtraComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService) { }

  copied = false;
  fadeOut = false;
  showChangeStatus = false;
  user: UserData | null = null;
  userStatus: String | null = null;
  private userSubscription: Subscription;

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser.subscribe(user => {
      this.user = user;
      this.userStatus = user?.status || null;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  copyToClipboard(): void {
    const textToCopy = `${this.user?.name}\#${this.user?.tag}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.fadeOut = true;
        setTimeout(() => {
          this.copied = false;
          this.fadeOut = false;
        }, 1000); // Duración de la animación fade-out
      }, 500); // Duración de la animación fade-in
    }).catch(err => {
      console.error('No se pudo copiar el texto: ', err);
    });
  }

  toggleChangeStatus(): void {
    this.showChangeStatus = !this.showChangeStatus;
  }

  changeUserStatus(newStatus: string) {
    this.userService.changeUserStatus(newStatus);
    this.userStatus = newStatus;
    this.toggleChangeStatus();
  }
}
