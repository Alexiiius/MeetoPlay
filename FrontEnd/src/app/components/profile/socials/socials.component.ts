import { Component, Input } from '@angular/core';
import { UserData } from '../../../interfaces/user-data';

@Component({
  selector: 'app-socials',
  standalone: true,
  imports: [],
  templateUrl: './socials.component.html',
  styleUrl: './socials.component.css'
})
export class SocialsComponent {

  @Input() user: UserData;
  @Input() isLoading: boolean;
}
