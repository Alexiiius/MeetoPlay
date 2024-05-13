import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ExtraComponent } from './extra/extra.component';

@Component({
  selector: 'app-profilecard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SettingsComponent,
    ExtraComponent
  ],
  templateUrl: './profilecard.component.html',
  styleUrl: './profilecard.component.css'
})
export class ProfilecardComponent {

  isLoggingOut = false;

  constructor() { }

  handleLoggingOut(isLoggingOut: boolean) {
    this.isLoggingOut = isLoggingOut;
  }

}
