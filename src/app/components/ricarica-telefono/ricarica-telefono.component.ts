import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BankService } from 'src/app/services/bank.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';

@Component({
  selector: 'app-ricarica-telefono',
  templateUrl: './ricarica-telefono.component.html',
  styleUrls: ['./ricarica-telefono.component.css']
})
export class RicaricaTelefonoComponent {
  numbers = [5,10,20,50,100];

  ricaricaForm = this.fb.group({
    numeroTelefono: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    amount: new FormControl(this.numbers[0], [Validators.required]),
    operatore: new FormControl('', [Validators.required])
  })

  constructor(private bankService: BankService,
              private fb: FormBuilder,
              private toastsMessagesService: ToastsMessagesService,
              private router: Router,
              private authService: AuthService){
  }

  ricaricaTelefono() {
    if (this.ricaricaForm.valid) {
      const { numeroTelefono, amount, operatore } = this.ricaricaForm.value;
      const description = `Ricarica telefono al numero ${numeroTelefono} pagata all'operatore ${operatore}`;
      this.bankService.ricaricaTelefono(amount!, description!)
        .subscribe(
          (value) => {
            this.toastsMessagesService.showSuccess(`Ricarica effettuata con successo!`)
            this.router.navigate(['/home'])
          },
          (error: HttpErrorResponse) => {
            let message = 'Errore generico, per favore riprova più tardi';
            if(error.status === 400) message = "Credito non sufficente"
            this.toastsMessagesService.showError(message);
          }
        );
    }
  }
}
