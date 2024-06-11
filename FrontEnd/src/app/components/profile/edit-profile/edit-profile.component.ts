import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { DndDirective } from './dnd.directive';
import { ProfileService } from '../../../services/profile.service';

import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { SocialLinkInputComponent } from './social-link-input/social-link-input.component';
import { UserSocials } from '../../../interfaces/user-socials';
import { UserData } from '../../../interfaces/user-data';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    DndDirective,
    CommonModule,
    FormsModule,
    SocialLinkInputComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{

  @ViewChild('editProfileModal') modalDialogEdit!: ElementRef<HTMLDialogElement>;
  @ViewChild('pass_confirmation_modal') modalDialog!: ElementRef<HTMLDialogElement>;

  socials: UserSocials = {
    Discord: '',
    Instagram: '',
    X: '',
    Steam: '',
    Twitch: '',
    Youtube: ''
  };

  @Input() user: UserData;

  showDropzone: boolean = false;

  originalAvatar: string;
  newAvatar: File | null = null;
  newAvatarUrl: string | null = null;

  originalNickname: string;
  newNickname: string;

  originalBio: string;
  newBio: string;

  isSavingAvatar: boolean = false;

  isSavingSocials: boolean = false;

  isCheckingPassword: boolean = false;
  password: string = '';
  showWrongPassword: boolean = false;

  isSavingBio: boolean = false;

  profileService = inject(ProfileService);
  alertService = inject(AlertService);

  constructor() { }

  ngOnInit() {
    this.profileService.profileAvatarUpdated.subscribe((newAvatarUrl: string) => {
      this.originalAvatar = newAvatarUrl;
    });
  }

  openEditProfileModal() {
    this.modalDialogEdit.nativeElement.showModal();

    this.originalNickname = this.user.name;
    this.newNickname = this.originalNickname;

    this.originalBio = this.user.bio;
    this.newBio = this.originalBio;

    this.originalAvatar = this.user.avatar;

    if (this.user.socials) {
      this.socials = this.user.socials;
      console.log('Socials:', this.socials);
    }
  }

  closeEditProfileModal() {
    this.modalDialogEdit.nativeElement.close();
  }

  openPassConfirmationModal() {
    // Comprobación de la longitud y de los espacios
    if (this.newNickname.length > 15 || /\s/g.test(this.newNickname)) {
      this.alertService.showAlert('warning', 'El nickname no puede tener más de 15 caracteres ni contener espacios.');
      this.isCheckingPassword = false;
      return;
    }
    this.modalDialog.nativeElement.showModal();
  }

  closePassConfirmationModal() {
    this.modalDialog.nativeElement.close();
  }

  toggleDropzone() {
    this.showDropzone = !this.showDropzone;
  }

  onFileDropped(files: FileList) {
    const file = files.item(0);
    if (file && file.type.startsWith('image/')) {
      this.newAvatar = file;
      this.newAvatarUrl = URL.createObjectURL(this.newAvatar);
    } else {
      this.alertService.showAlert('error', 'Solo se permiten imágenes 📸');
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.newAvatar = file;
      this.newAvatarUrl = URL.createObjectURL(this.newAvatar);
    }
  }

  saveNewNickname() {
  this.isCheckingPassword = true;
  if (this.newNickname !== this.originalNickname) {

    this.profileService.updateName(this.newNickname, this.password).subscribe(
      (response) => {
        console.log('Name updated:', response);
        this.alertService.showAlert('success', 'Nickname actualizado correctamente 🎉');
        this.originalNickname = this.newNickname;
        this.profileService.profileNameUpdated.next(this.newNickname);
        this.isCheckingPassword = false;
        this.closePassConfirmationModal();
      },
      (error) => {
        console.error('Error updating name:', error);
        this.alertService.showAlert('error', 'Error al actualizar tu nickname 😢');
        this.isCheckingPassword = false;
        this.showWrongPassword =  true;
      });
  }
}

  saveNewBio() {
    this.isSavingBio = true;
    if (this.newBio !== this.originalBio) {
      this.profileService.updateBio(this.newBio).subscribe(
        (response) => {
          console.log('Bio updated:', response);
          this.alertService.showAlert('success', 'Biografía actualizada correctamente 🎉');
          this.originalBio = this.newBio;
          this.profileService.profileBioUpdated.next(this.newBio);
          this.isSavingBio = false;
        },
        (error) => {
          console.error('Error updating bio:', error);
          this.alertService.showAlert('error', 'Error al actualizar tu biografía 😢');
          this.isSavingBio = false;
        });
    }
  }

  saveNewSocials(event: { socialNetwork: string, newSocialLink: string }) {
    this.isSavingSocials = true;
    this.socials[event.socialNetwork] = event.newSocialLink;

    this.profileService.updateSocials(this.socials).subscribe(
      (response) => {
        console.log('Socials updated:', response);
        this.alertService.showAlert('success', 'Redes sociales actualizadas correctamente 🎉');
        this.isSavingSocials = false;
      },
      (error) => {
        console.error('Error updating socials:', error);
        this.alertService.showAlert('error', 'Error actualizando redes sociales 😢');
        this.isSavingSocials = false;
      });
  }


  saveNewAvatar() {
    this.isSavingAvatar = true;
    if (this.newAvatar) {
      this.profileService.updateAvatar(this.newAvatar).subscribe(
        (response) => {
          console.log('Avatar updated:', response);
          this.isSavingAvatar = false;
          const updatedAvatarUrl = response.data.avatar + '?t=' + Date.now();
          this.profileService.profileAvatarUpdated.next(updatedAvatarUrl);
          this.alertService.showAlert('success', 'Avatar actualizado correctamente 🎉');
          this.toggleDropzone();
          this.newAvatar = null;
          this.newAvatarUrl = null;
        },
        (error) => {
          console.error('Error updating avatar:', error);
          this.isSavingAvatar = false;
          this.alertService.showAlert('error', 'Error actualizando avatar 😢');
          this.newAvatar = null;
          this.newAvatarUrl = null;
        });

    } else {
      console.error('No new avatar selected');
    }
  }
}
