import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardRiepilogo } from '../../interfaces/dashboard-riepilogo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']  // anche se vuoto, puoi tenerlo
})
export class DashboardComponent implements OnInit {
  riepilogo?: DashboardRiepilogo;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getRiepilogo().subscribe({
      next: (data) => (this.riepilogo = data),
      error: (err) => console.error('Errore caricamento riepilogo:', err),
    });
  }
}
