import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-social-link-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './social-link-input.component.html',
  styleUrl: './social-link-input.component.css'
})
export class SocialLinkInputComponent {

  @Input() isSavingSocials: boolean;
  @Input() socialNetwork: 'Instagram' | 'X' | 'Discord' | 'Steam' | 'Twitch' | 'YouTube';
  @Input() socialLink: string;
  @Output() socialLinkUpdated = new EventEmitter<{socialNetwork: string, newSocialLink: string}>();

  newSocialLink: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['socialLink']) {
      this.newSocialLink = this.socialLink;
    }
  }

  updateSocialLink(socialNetwork: string, newSocialLink: string) {
    this.socialLinkUpdated.emit({socialNetwork, newSocialLink});
  }
}
