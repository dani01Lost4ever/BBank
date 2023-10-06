import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  options: AnimationOptions = {
    path: "/assets/images/Animation.json"
  };

  constructor(protected fb: FormBuilder) { }
}
