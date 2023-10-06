import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { omitBy } from 'lodash';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { BankService, Filters, ListTransactions, Transactions } from 'src/app/services/bank.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';

export interface Name {
  code: string;
}

@Component({
  selector: 'app-movimenti1',
  templateUrl: './movimenti1.component.html',
  styleUrls: ['./movimenti1.component.css']
})
export class Movimenti1Component implements OnInit, OnDestroy {
  transactions!: Transactions[]
  numbers = [5, 10, 25, 50, 75]

  private destroyed$ = new Subject<void>()

  constructor(private bankService: BankService,
              public dialog: MatDialog){}

              first: number = 0;

              rows: number = 10;

  openDialog(transaction: Transactions): void {
    const dialogRef = this.dialog.open(DialogDetailComponent, {
      data: transaction,
    });
  }

  typeTypelogy(category: "Entrata" | "Uscita" | "New Account"){
    if(category === "Entrata") return "+"
    else if(category === "Uscita") return "-"
    else return ""
  }

  changeSelection(number: number){
    const q = {
      num: number
    }
    this.bankService.changeFilters(q as Filters);
  }

  ngOnInit() {
    this.bankService.transactions$.subscribe(value => {
      const v = value as ListTransactions;
      this.transactions = v.transactions;
    })
    this.changeSelection(this.numbers[0])
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
