import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserData } from '../../../interfaces/user-data';
import { CommonModule } from '@angular/common';
import { UserReduced } from '../../../interfaces/user-reduced';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})


export class UsersListComponent {

  list: 'friends' | 'followers' | 'followed';
  userList: UserReduced[];
  @ViewChild('userListModal') modalDialog!: ElementRef<HTMLDialogElement>;

  openModal(list: string, userList: UserReduced[]) {
    this.modalDialog.nativeElement.showModal();
    this.list = list as 'friends' | 'followers' | 'followed';
    this.userList = userList;
  }

  closeModal() {
    this.modalDialog.nativeElement.close();
  }
}
