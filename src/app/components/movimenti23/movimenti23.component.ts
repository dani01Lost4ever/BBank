import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { BankService, Categories, Filters, ListTransactions, Transactions } from 'src/app/services/bank.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Paginator } from 'primeng/paginator';
import { InputNumber } from 'primeng/inputnumber';
import { MatInput } from '@angular/material/input';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { exportTable } from 'src/utils/exportTable';

@Component({
  selector: 'app-movimenti23',
  templateUrl: './movimenti23.component.html',
  styleUrls: ['./movimenti23.component.css']
})
export class Movimenti23Component {
  filtriForm = this.fb.group({
    num: new FormControl(),
    categoryId: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl()
  })

  categoryid = this.bankService.type$

  first: number = 0;

  transactions!: Transactions[]

  ExportTable = new exportTable()

  private destroyed$ = new Subject<void>()

  constructor(private bankService: BankService,
              public dialog: MatDialog,
              private fb: FormBuilder){}

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

  reset() {
    this.first = 0;
    this.filtriForm.value.num = 5
  }

  resetFiltri(){
    this.filtriForm.reset()
  }

  exportArray(ext: "xlsx" | "csv") {
    const onlyNameAndSymbolArr: Partial<any>[] = this.transactions.map(x => {
      const k = x as any;
      return [
        new Date(k.date).toLocaleDateString() + " " + new Date(k.date).toLocaleTimeString(),
        `€ ${k.amount}`,
        k.categoryid.category,
        k.categoryid.typology,
        k.description
      ]
    })
    const Headers = ["Data", "Importo", "Categoria", "Tipologia", "Descrizione"]
    this.ExportTable.exportArray(Headers, onlyNameAndSymbolArr, ext);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  ngOnInit() {
    this.bankService.transactions$.subscribe(value => {
      if(this.filtriForm.valid){
        const v = value as ListTransactions;
        this.transactions = v.transactions;
      }
    })

    this.filtriForm.valueChanges.subscribe(value => {
      if(typeof(this.filtriForm.get('num')?.value) === "number" && this.filtriForm.get('num')?.value <= 0){
        this.filtriForm.get('num')?.setValue(null)
        value.num = null
      }
      if(this.filtriForm.get('startDate')?.value){
        const startDate = new Date(this.filtriForm.get('startDate')?.value!).toISOString()
        value.startDate = encodeURI(startDate)
        const endDate = new Date(Date.now()).toISOString()
        value.endDate = encodeURI(endDate)
      }
      if(this.filtriForm.get('endDate')?.value){
        const endDate = new Date(this.filtriForm.get('endDate')?.value!).toISOString()
        value.endDate = encodeURI(endDate)
      }
      const filtri = value as Filters;
      this.bankService.changeFilters(filtri);
      }
    )
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
