import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null | undefined;

  constructor(private authService: AuthService){
    authService.currentUser$.subscribe(value => this.user = value)
  }

  ngOnInit(): void {

  }
}
