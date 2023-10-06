import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs"
import { JwtService } from "./jwt.service";
import { environment } from "src/environments/environment";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  picture: string;
  iban: string;
  date: Date;
}

interface Balance {
  balance: number
}

export interface AccountBalance {
  accout: Balance[]
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private url = environment.apiUrl;

  private _currentUser$ = new BehaviorSubject<User | null>(null);

  currentUser$ = this._currentUser$.asObservable();

  constructor(private jwtSrv: JwtService,
              private http: HttpClient,
              private router: Router) {
    this.fetchUser();
  }

  isLoggedIn() {
    return this.jwtSrv.hasToken();
  }

  login(username: string, password: string) {
    return this.http.post<{user: User, token: string}>(`${this.url}/api/login`, {username, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }

  register(firstName: string, lastName: string, username: string, password: string, confermaPassword: string) {
    return this.http.post<{user: User, token: string}>(`${this.url}/api/register`, {firstName, lastName, username, password, confermaPassword})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }

  changePassword(oldPassword: string, newPassword: string){
    return this.http.patch<{message: string}>(`${this.url}/api/changePassword`, {oldPassword, newPassword})
      .pipe(
        map(res => res.message)
      )
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/auth/login']);
  }

  getBalance() {
    return this.http.get<AccountBalance>(`${this.url}/api/users/balance`)
      .pipe(
        catchError(error => throwError(error))
      )
  }

  private fetchUser() {
    this.http.get<User>(`${this.url}/api/users/me`)
      .pipe(
        catchError(error => {
          if(this.isLoggedIn()) this.jwtSrv.removeToken();
          return throwError(error)
        })
      )
      .subscribe(user => {
        this._currentUser$.next(user);
      });
  }
}