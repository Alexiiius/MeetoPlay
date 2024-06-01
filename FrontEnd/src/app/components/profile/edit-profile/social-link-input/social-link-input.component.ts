import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-social-link-input',
  standalone: true,
  imports: [],
  templateUrl: './social-link-input.component.html',
  styleUrl: './social-link-input.component.css'
})
export class SocialLinkInputComponent {

  @Input() socialNetwork: 'Instagram' | 'Twitter' | 'Discord' | 'Steam' | 'Twitch' | 'YouTube';
}
