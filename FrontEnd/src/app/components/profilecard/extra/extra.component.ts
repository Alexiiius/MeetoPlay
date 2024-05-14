import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserData } from '../../../interfaces/user-data';
import { UserExtraStatusComponent } from './user-status/user-extra-status.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-extra',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UserExtraStatusComponent
  ],
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.css'
})
export class ExtraComponent {

  constructor(private userService: UserService) { }

  copied = false;
  fadeOut = false;
  showChangeStatus = false;
  user: UserData = this.userService.getUserData();
  userStatus: String = this.user?.status;

  ngOnInit(): void {
    this.userStatus = this.user?.status;
  }

  copyToClipboard(): void {
    const textToCopy = `${this.user.name}\#${this.user.tag}`;
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
    this.toggleChangeStatus();
  }
}
