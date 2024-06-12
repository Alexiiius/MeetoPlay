import { Component, Input, OnInit } from '@angular/core';
import { UserData } from '../../../interfaces/user-data';
import { debounceTime, fromEvent, merge, startWith, switchMap, tap, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserStatusComponent } from '../user-status/user-status.component';
import { ProfileService } from '../../../services/profile.service';


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
export class ExtraComponent implements OnInit{

  constructor(private profileService: ProfileService) { }

  copied = false;
  fadeOut = false;
  showChangeStatus = false;
  @Input() user: UserData | null = null;
  @Input() isLoading: boolean;

  userStatus: string;
  intentionallyAfk = false;

  ngOnInit() {
    const events = ['mousemove', 'keypress', 'scroll'];
    const eventStreams = events.map((event) => fromEvent(window, event));
    const activity$ = merge(...eventStreams).pipe(startWith(null));

    activity$
      .pipe(
        debounceTime(1000), // espera 1 segundo sin actividad antes de cambiar el estado a "online"
        tap(() => {
          //Si el usuario está en estado afk y no ha sido intencionalmente, lo cambia a online
          if (this.userStatus === 'afk' || this.userStatus === 'Afk' && !this.intentionallyAfk) {
            this.changeUserStatus('online');
          }
        }),
        // cada vez que se detecta una actividad, reinicia el temporizador
        switchMap(() => {
          return timer(5 * 60 * 1000); // 5 minutos
        }),
        tap(() => {
          if (this.userStatus === 'online' || this.userStatus === 'Online') {
            this.changeUserStatus('afk');
          }
        })
      )
      .subscribe();
  }

  ngOnChanges() {
    if (this.user) {
      this.userStatus = this.user.status;
      this.intentionallyAfk = localStorage.getItem('intentionallyAfk') === 'true';
    }
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
    this.showChangeStatus = false;
    const capitalizedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    this.profileService.userStatusChanged.next(capitalizedStatus);
    this.userStatus = newStatus;
    localStorage.setItem('user_status', capitalizedStatus);
    this.profileService.setUserStatus(newStatus).subscribe();
  }

  setIntentionallyAfk(value: boolean) {
    this.intentionallyAfk = value;
    localStorage.setItem('intentionallyAfk', value.toString());
  }

}
