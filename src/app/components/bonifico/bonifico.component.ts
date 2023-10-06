import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BankService, Transactions } from 'src/app/services/bank.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';

@Component({
  selector: 'app-bonifico',
  templateUrl: './bonifico.component.html',
  styleUrls: ['./bonifico.component.css']
})
export class BonificoComponent implements OnInit {
  bonificoForm = this.fb.group({
    iban: new FormControl('', [Validators.required]),
    amount: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required])
  })

  max: number = 0;

  constructor(private bankService: BankService,
              private fb: FormBuilder,
              private toastsMessagesService: ToastsMessagesService,
              private router: Router,
              private authService: AuthService){
  }

  bonifico() {
    if (this.bonificoForm.valid) {
      const { iban, amount, description } = this.bonificoForm.value;
      this.bankService.bonifico(iban!, amount!, description!)
        .subscribe(
          (value) => {
            this.toastsMessagesService.showSuccess(`Bonifico inviato con successo all'iban ${iban}!`)
            this.router.navigate(['/home'])
          },
          (error: HttpErrorResponse) => {
            let message = 'Errore generico, per favore riprova più tardi';
            if(error.status === 400) message = "IBAN non corretto";
            this.toastsMessagesService.showError(message);
          }
        );
    }
  }

  ngOnInit(): void {
    this.bonificoForm.valueChanges.subscribe(value => {
      if(value.amount! > this.max){
        this.bonificoForm.get('amount')?.setValue(this.max)        
      }else if(value.amount! < 0){
        this.bonificoForm.get('amount')?.setValue(0)        
      }
    })
    this.authService.getBalance().subscribe(value => this.max = value.accout?.[0].balance)
  }
}
