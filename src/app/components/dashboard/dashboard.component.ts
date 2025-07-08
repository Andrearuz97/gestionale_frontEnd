import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardRiepilogo } from '../../interfaces/dashboard-riepilogo';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  riepilogo?: DashboardRiepilogo;
  nomeUtente: string | null = '';
  filtroPeriodo: string = 'oggi'; // valori: oggi, 7giorni, mese, anno, tutto

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.nomeUtente = this.authService.getUserName();
    this.aggiornaDashboard();
  }

  aggiornaDashboard(): void {
    this.dashboardService.getRiepilogo(this.filtroPeriodo).subscribe({
      next: (data) => this.riepilogo = data,
      error: (err) => console.error('Errore caricamento riepilogo:', err),
    });
  }
}
