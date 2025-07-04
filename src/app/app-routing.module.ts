import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { TrattamentiComponent } from './components/trattamenti/trattamenti.component';
import { NuovaPrenotazioneComponent } from './components/nuova-prenotazione/nuova-prenotazione.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'prenotazioni', component: PrenotazioniComponent },
  { path: 'trattamenti', component: TrattamentiComponent },
  { path: 'nuova-prenotazione', component: NuovaPrenotazioneComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
