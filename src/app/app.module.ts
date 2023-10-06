import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/pages/login/login.component';
import { materials } from './materials';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { AuthComponent } from './components/auth/auth.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HomeComponent } from './components/home/home.component';
import { primeng } from './primeng';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { Movimenti1Component } from './components/movimenti1/movimenti1.component';
import { ApexchartsComponent } from './components/apexcharts/apexcharts.component';
import { DateUfficialPipe } from './pipes/date-ufficial.pipe';
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProfileComponent } from './components/profile/profile.component';
import { DialogDetailComponent } from './components/dialog-detail/dialog-detail.component';
import { DateTimeUfficialPipe } from './pipes/date-time-ufficial.pipe';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BonificoComponent } from './components/bonifico/bonifico.component';
import { RicaricaTelefonoComponent } from './components/ricarica-telefono/ricarica-telefono.component';
import { TransazioniGeneraliComponent } from './components/transazioni-generali/transazioni-generali.component';
import { Movimenti23Component } from './components/movimenti23/movimenti23.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    HomeComponent,
    NavbarComponent,
    Movimenti1Component,
    ApexchartsComponent,
    DateUfficialPipe,
    ProfileComponent,
    DialogDetailComponent,
    DateTimeUfficialPipe,
    ChangePasswordComponent,
    BonificoComponent,
    RicaricaTelefonoComponent,
    TransazioniGeneraliComponent,
    Movimenti23Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgProgressModule.withConfig({
      color: "darkgreen"
    }),
    NgProgressHttpModule,
    NgApexchartsModule,
    CommonModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    materials,
    primeng
  ],
  providers: [
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    MessageService,
    MatIconRegistry
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
