import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isNil, omitBy } from 'lodash';
import { BehaviorSubject, ReplaySubject, catchError, combineLatest, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Filters {
  num?: number;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}

export interface Categories {
  category: string;
  typology: "Entrata" | "Uscita" | "New Account",
  id: string;  
}

export interface Transactions {
  date: Date;
  amount: number;
  balance: number;
  categoryid: Categories;
  description: string;
}

export interface ListTransactions {
  transactions: Transactions[];
}

@Injectable({
  providedIn: 'root'
})
export class BankService {  
  private url = environment.apiUrl

  private _filters$ = new BehaviorSubject<Filters | null>(null);
  filters$ = this._filters$.asObservable();
  private _type$ = new BehaviorSubject<Categories[] | null>(null);
  type$ = this._type$.asObservable();
  private _requestUpdate$ = new ReplaySubject<void>();

  transactions$ = combineLatest([
    this._requestUpdate$,
    this.filters$
  ]).pipe(
    catchError(err => {
      console.log(err);
      throwError(err);
      return []
    }),
    switchMap(
      ([_, filters]) => {
        const q = omitBy(filters, isNil);
        return this.http.get<ListTransactions>(`${this.url}/api/transaction/research`, {params: q})
          .pipe(
            catchError(err => of([]))
          )
      }
    )
  )

  constructor(private http: HttpClient) {
    this._requestUpdate$.next();
    this.transactionType()
  }

  changeFilters(q: Filters){
    this._filters$.next(q);
  }

  bonifico(iban: string, amount: number, description: string){
    const categoryid = "650d854dde65f59e517de0c5";
    return this.http.post<Transactions>(`${this.url}/api/transaction`, {iban, amount, categoryid, description})
  }

  ricaricaTelefono(amount: number, description: string){
    const categoryid = "650d866cff8d876d587ff46a";
    return this.http.post<Transactions>(`${this.url}/api/transaction`, {amount, categoryid, description})
  }

  transazioneGenerale(amount: number, description: string, categoryid: string){
    return this.http.post<Transactions>(`${this.url}/api/transaction`, {amount, categoryid, description})
  }
  
  transactionType(){
    return this.http.get<Categories[]>(`${this.url}/api/transaction-type`).subscribe(value => this._type$.next(value))
  }
}
