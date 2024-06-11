import { Component, Input } from '@angular/core';
import { UserSocials } from '../../../interfaces/user-socials';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './socials.component.html',
  styleUrl: './socials.component.css'
})
export class SocialsComponent {

  @Input() socials: UserSocials;
  @Input() isLoading: boolean;
}
