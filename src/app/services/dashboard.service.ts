import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardRiepilogo } from '../interfaces/dashboard-riepilogo';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:9090/api/dashboard/riepilogo';

  constructor(private http: HttpClient) {}

  getRiepilogo(periodo: string = 'oggi'): Observable<DashboardRiepilogo> {
    const params = new HttpParams().set('periodo', periodo);
    return this.http.get<DashboardRiepilogo>(this.apiUrl, { params });
  }
}
