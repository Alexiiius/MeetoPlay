import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserData } from '../../../interfaces/user-data';
import { UserService } from '../../../services/user.service';
import { debounceTime, fromEvent, merge, startWith, Subscription, switchMap, tap, timer } from 'rxjs';
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
export class ExtraComponent implements OnInit{

  constructor(private userService: UserService) { }

  copied = false;
  fadeOut = false;
  showChangeStatus = false;
  @Input() user: UserData | null = null;
  @Input() isLoading: boolean;
  userStatus: string;

  ngOnInit() {
    console.log('ExtraComponent inicializado');
    const events = ['mousemove', 'keypress', 'scroll'];
    const eventStreams = events.map((event) => fromEvent(window, event));
    const activity$ = merge(...eventStreams).pipe(startWith(null));

    activity$
      .pipe(
        debounceTime(1000), // espera 1 segundo sin actividad antes de cambiar el estado a "online"
        tap(() => {
          if (this.userStatus !== 'online') {
            this.changeUserStatus('online');
          }
        }),
        // cada vez que se detecta una actividad, reinicia el temporizador
        switchMap(() => {
          return timer(5 * 60 * 1000); // 5 minutos
        }),
        tap(() => {
          if (this.userStatus !== 'afk') {
            this.changeUserStatus('afk');
          }
        })
      )
      .subscribe();
  }

  ngOnChanges() {
    if (this.user) {
      this.userStatus = this.user.status;
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
    this.userService.userStatusChanged.next(capitalizedStatus);
    this.userStatus = newStatus;
    this.userService.setUserStatus(newStatus).subscribe(
      (response) => {
        console.log('Estado del usuario cambiado correctamente: ', response);
      },
      (error) => {
        console.error('Error al cambiar el estado del usuario: ', error);
      }
    );
  }


}
