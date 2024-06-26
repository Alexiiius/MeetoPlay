import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { forkJoin } from 'rxjs';
import { UserReduceFollowing } from '../../../interfaces/user-reduce-following';
import { Router, RouterLink } from '@angular/router';
import { UserReduced } from '../../../interfaces/user-reduced';
import { ChatsService } from '../../../services/chats.service';

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

  @Input() logedUserId: number;

  @ViewChild('userListModal') modalDialog!: ElementRef<HTMLDialogElement>;

  @Output() userFollowed = new EventEmitter<any>();

  constructor(
    private userService: UserService,
    private chatService: ChatsService,
    private router: Router) { }

  openModal(list: string, userList: UserReduceFollowing[]) {
    this.modalDialog.nativeElement.showModal();
    this.list = list as 'friends' | 'followers' | 'followed';
    this.userList = userList;

    // Si userList está vacío, establecer isLoading a false y retornar
    if (userList.length === 0) {
      this.isLoading = false;
      return;
    }

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

      // Emit the event with the list type
      this.userFollowed.emit();
    });
  }

  isLogedUser(userId: number): boolean {
    return this.logedUserId === userId;
  }

  chatButtonClicked(user: UserReduceFollowing) {
    const userReduced: UserReduced = {
      id: user.id,
      name: user.name,
      tag: user.tag,
      full_tag: `${user.name}#${user.tag}`,
      avatar: user.avatar,
      status: user.status
    };

    this.chatService.newChatCreated.next(userReduced);
  }
}
