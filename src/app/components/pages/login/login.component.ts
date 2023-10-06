import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { MessageService } from 'primeng/api';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required])
  })

  hide = true;

  options: AnimationOptions = {
    path: "/assets/images/Animation.json"
  };

  togglePasswordVisibility(event: Event){
    event.stopPropagation();
    this.hide = !this.hide;
  }

  private destroyed$ = new Subject<void>();

  constructor(protected fb: FormBuilder,
              private authSrv: AuthService,
              private router: Router,
              private toastsMessagesService: ToastsMessagesService) { }

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(value => {
        setTimeout(() => {      
          if(this.loginForm.value.email || this.loginForm.value.password){
            this.toastsMessagesService.showInfo("Passati 30 secondi, credenziali cancellate")
            this.loginForm.reset();
          }
        }, 30000);
      })
  }

  ngOnDestroy(): void {
    this.loginForm.value.email = "";
    this.loginForm.value.password = "";
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authSrv.login(email!, password!)
        .pipe(
          catchError(err => {
            return throwError(() => err);   
          })
        )
        .subscribe(
          (value) => this.router.navigate(['/home']),
          (error: HttpErrorResponse) => {
            if(error.status === 401) this.toastsMessagesService.showError("Email o password non corretti")
          }
        );
    }
  }

  getErrorMessage() {
    const email = this.loginForm.get('email');
    return email?.invalid && email.value !== '' ? 'Email non valida' : '';
  }
}
