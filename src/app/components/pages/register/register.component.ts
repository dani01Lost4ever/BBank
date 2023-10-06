import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';
import { ConfirmStateMatcher, MyErrorStateMatcher } from 'src/utils/default.error-matcher';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*([0-9]|[^A-Za-z0-9])).{8,}$")]),
    confirmPassword: new FormControl('', [Validators.required])
  }, {
    validators: [
      (group: FormGroup) => {
        const pValue = group.controls['password'].value;
        const cValue = group.controls['confirmPassword'].value;
        if (pValue !== cValue) {
          return {passwordMissmatch: true};
        } else {
          return null;
        }
      }
    ]
  })

  matcher = new MyErrorStateMatcher();
  matcherConfirm = new ConfirmStateMatcher();

  hide = true;
  hideConfirm = true;
  loginError = '';

  togglePasswordVisibility(event: Event){
    event.stopPropagation();
    this.hide = !this.hide;
  }

  togglePasswordVisibilityConfirm(event: Event){
    event.stopPropagation();
    this.hideConfirm = !this.hide;
  }

  private destroyed$ = new Subject<void>();

  constructor(protected fb: FormBuilder,
              private authSrv: AuthService,
              private router: Router,
              private toastsMEssagesService: ToastsMessagesService) { }
              
  ngOnInit(): void {
    this.registerForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.loginError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password, confirmPassword } = this.registerForm.value;
      this.authSrv.register(firstName!, lastName!, email!, password!, confirmPassword!)
        .pipe(
          catchError(err => {
            this.loginError = err.error.message;
            return throwError(() => err);   
          })
        )
        .subscribe(
          (value) => {
            this.toastsMEssagesService.showSuccess("Profilo creato con successo!")
            this.router.navigate(['/auth/login'])
          },
          (error: HttpErrorResponse) => {
            if(error.status === 401) {
              this.toastsMEssagesService.showInfo("Profilo già esistente")
              return
            };
            let message = 'Errore generico, per favore riprova più tardi';
            this.toastsMEssagesService.showError(message);
          }
        );
    }
  }

  getErrorMessage() {
    const email = this.registerForm.get('email');
    return email?.invalid && email.value !== '' ? 'Email non valida' : '';
  }

  getPasswordMessage() {
    const password = this.registerForm.get('password');
    let message = "";

      // Verifica se la password contiene almeno un carattere maiuscolo
      if (!/[A-Z]/.test(password!.value!)) {
        message += "1 maiuscola"
      }

      // Verifica se la password contiene almeno un carattere minuscolo
      if (!/[a-z]/.test(password!.value!)) {
        if(message !== "") message += ", ";
        message += "1 minuscola";
      }

      // Verifica se la password contiene almeno un numero
      if (!/[0-9]/.test(password!.value!) && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password!.value!)) {
        if(message !== "") message += ", ";
        message += "1 speciale o 1 numero";
      }

      if(password?.invalid){
        if(password.value!.length < 8){
          if(message !== "") message += ", ";
          message += "minimo 8"
        }
    }

    return `${message}`;
  }

  getPasswordMessageConfirm() {
    const password = this.registerForm.get('password');
    const passwordConfirm = this.registerForm.get('confirmPassword');
    if(password?.value !== passwordConfirm?.value) {
      return "Le password devono essere uguali"
    }
    return ""
  }
}
