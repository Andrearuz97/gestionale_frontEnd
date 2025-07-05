import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { TrattamentiComponent } from './components/trattamenti/trattamenti.component';
import { NuovaPrenotazioneComponent } from './components/nuova-prenotazione/nuova-prenotazione.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'prenotazioni', component: PrenotazioniComponent, canActivate: [AuthGuard] },
  { path: 'trattamenti', component: TrattamentiComponent, canActivate: [AuthGuard] },
  { path: 'nuova-prenotazione', component: NuovaPrenotazioneComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
