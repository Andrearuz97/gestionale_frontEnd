import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TrattamentiComponent } from './components/trattamenti/trattamenti.component';

import { LoginComponent } from './auth/login/login.component';
import { ClientiComponent } from './components/clienti/clienti.component';

// ✅ Lingua italiana
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

// 👇 Interceptor JWT
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PrenotazioniComponent,
    NavbarComponent,
    TrattamentiComponent,
    LoginComponent,
    ClientiComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgSelectModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    // ✅ Imposta la lingua di default italiana
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
