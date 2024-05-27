import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { forkJoin } from 'rxjs';
import { UserReduceFollowing } from '../../../interfaces/user-reduce-following';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})

//TODO hacer un emiter para que cuando se siga a un usuario se actualice la lista de seguidos

export class UsersListComponent {

  listTranslations = {
    'friends': 'amigos',
    'followers': 'seguidores',
    'followed': 'seguidos'
  };

  list: 'friends' | 'followers' | 'followed';
  userList: UserReduceFollowing[];
  isLoading: boolean = false;
  isFollowingLoading: { [userId: number]: boolean } = {};

  @ViewChild('userListModal') modalDialog!: ElementRef<HTMLDialogElement>;

  constructor(private userService: UserService) { }

  openModal(list: string, userList: UserReduceFollowing[]) {
    this.modalDialog.nativeElement.showModal();
    this.list = list as 'friends' | 'followers' | 'followed';
    this.userList = userList;

    this.isLoading = true;

    // Crear un array de observables
    const observables = userList.map(user => this.userService.isFollowing(user.id));

    // Ejecutar todas las llamadas a la API en paralelo
    forkJoin(observables).subscribe(results => {
      // Asignar los resultados a las propiedades correspondientes de los usuarios
      this.userList = userList.map((user, index) => ({
        ...user,
        isFollowing: results[index].data.boolean
      })) as UserReduceFollowing[];

      this.isLoading = false;
    });

  }

  closeModal() {
    this.modalDialog.nativeElement.close();
  }

  followUser(userId: number) {
    this.isFollowingLoading[userId] = true;
    this.userService.followUser(userId).subscribe(() => {
      const user = this.userList.find(user => user.id === userId);
      if (user) {
        user.isFollowing = true;
      }
      this.isFollowingLoading[userId] = false;
    });
  }
}
