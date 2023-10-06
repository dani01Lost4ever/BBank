import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { justLoggedGuard } from './guards/just-logged.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BonificoComponent } from './components/bonifico/bonifico.component';
import { RicaricaTelefonoComponent } from './components/ricarica-telefono/ricarica-telefono.component';
import { TransazioniGeneraliComponent } from './components/transazioni-generali/transazioni-generali.component';
import { Movimenti23Component } from './components/movimenti23/movimenti23.component';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [justLoggedGuard],
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'movimenti',
        component: Movimenti23Component
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'bonifico',
        component: BonificoComponent
      },
      {
        path: 'ricarica-telefono',
        component: RicaricaTelefonoComponent
      },
      {
        path: 'transazioni-generali',
        component: TransazioniGeneraliComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
