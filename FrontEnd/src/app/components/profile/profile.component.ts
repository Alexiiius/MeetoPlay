import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserData } from '../../interfaces/user-data';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: UserData; //TODO create userComplete interface
  isLoading = true;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getUserById(params['id']).subscribe(user => {
        this.user = user;
        this.isLoading = false;
      });
    });
  }
}
