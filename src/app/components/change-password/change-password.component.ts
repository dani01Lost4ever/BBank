import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Subject, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';
import { ConfirmStateMatcher, MyErrorStateMatcher } from 'src/utils/default.error-matcher';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordForm = this.fb.group({
    password: ['', {validators: Validators.required, min: 8, max: 20}]
  })

  newPasswordForm = this.fb.group({
    newPassword: ['', {validators: [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*([0-9]|[^A-Za-z0-9])).{8,}$")]}]
  })

  repeatPasswordForm = this.fb.group({
    repeatPassword: ['', {validators: Validators.required, min: 8}]
  }, {
    validators: [
      (group: FormGroup) => {
        const pValue = this.newPasswordForm.get('newPassword')?.value;
        const cValue = group.controls['repeatPassword'].value;
        if (pValue !== cValue) {
          return {passwordMissmatch: true};
        } else {
          return null;
        }
      }
    ]
  })

  hide = true;

  matcher = new MyErrorStateMatcher();
  matcherConfirm = new ConfirmStateMatcher();

  private destroyed$ = new Subject<void>();

  constructor(private authService: AuthService,
              protected fb: FormBuilder,
              private toastsMessagesService: ToastsMessagesService){}
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  hideInput(){
    this.hide = true;
  }

  checkSame(){
    this.hide = true;
    if(this.newPasswordForm.value.newPassword === this.repeatPasswordForm.value.repeatPassword){
      return true;
    }
    return false;
  }

  getPasswordMessage() {
    try{
      const password = this.newPasswordForm.get('newPassword');

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
    }catch(error){
      return '';
    }
  }

  changePassword(stepper: MatStepper){
    this.passwordForm
    if (this.passwordForm.valid  && this.newPasswordForm.valid && this.repeatPasswordForm.valid) {
      const password = this.passwordForm.value.password; 
      const newPassword = this.newPasswordForm.value.newPassword; 
      this.authService.changePassword(password!, newPassword!)
        .pipe(
          catchError(err => {
            if(err.status === 401) this.toastsMessagesService.showError("Password vecchia sbagliata")
            else this.toastsMessagesService.showError("Errore")
            return throwError(() => err);   
          })
        )
        .subscribe(() => {
          this.toastsMessagesService.showSuccess("Password cambiata")
          this.passwordForm.reset()
          this.newPasswordForm.reset()
          this.repeatPasswordForm.reset()
          stepper.reset()
        });
    }
  }

  getPasswordMessageConfirm() {
    try{
      const password = this.newPasswordForm.get('newPassword');
      const passwordConfirm = this.repeatPasswordForm.get('repeatPassword');
      if(password?.value !== passwordConfirm?.value) {
        return "Le password devono essere uguali"
      }
      return ""
    }catch(error){
      return '';
    }
  }
}
