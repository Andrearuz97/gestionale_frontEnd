import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // <-- aggiunto

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TrattamentiComponent } from './components/trattamenti/trattamenti.component';
import { NuovaPrenotazioneComponent } from './components/nuova-prenotazione/nuova-prenotazione.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PrenotazioniComponent,
    NavbarComponent,
    TrattamentiComponent,
    NuovaPrenotazioneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule  // <-- importante per ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
