import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  isSideMenuOpen: boolean = false;

  toggleSideMenu() {
    this.isSideMenuOpen = !this.isSideMenuOpen;

    const layout = document.querySelector('.layout');

    if (this.isSideMenuOpen) {
      layout?.classList.add('overlay');
    } else {
      layout?.classList.remove('overlay');
    }
  }

}
