import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TrattamentiComponent } from './components/trattamenti/trattamenti.component';
import { NuovaPrenotazioneComponent } from './components/nuova-prenotazione/nuova-prenotazione.component';
import { LoginComponent } from './auth/login/login.component';

// 👇 Importa l’interceptor
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PrenotazioniComponent,
    NavbarComponent,
    TrattamentiComponent,
    NuovaPrenotazioneComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
