import { Component, inject } from '@angular/core';
import { DndDirective } from './dnd.directive';
import { ProfileService } from '../../../services/profile.service';

import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { SocialLinkInputComponent } from './social-link-input/social-link-input.component';

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
export class EditProfileComponent {

  showDropzone: boolean = false;

  newAvatar: File | null = null;
  newAvatarUrl: string | null = null;

  originalNickname: string = 'Vaker0';
  newNickname: string = this.originalNickname;

  originalBio: string = 'I love coding!';
  newBio: string = this.originalBio;

  isSavingAvatar: boolean = false;

  profileService = inject(ProfileService);
  alertService = inject(AlertService);

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
