import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prenotazione } from '../interfaces/prenotazione';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioniService {
  private apiUrl = 'http://localhost:9090/api/prenotazioni';

  constructor(private http: HttpClient) {}

  getPrenotazioni(queryParams?: { nome?: string; cognome?: string; nomeCompleto?: string; data?: string }): Observable<Prenotazione[]> {
    let url = this.apiUrl;

    if (queryParams) {
      const params = [];

      if (queryParams.nomeCompleto) {
        params.push(`nomeCompleto=${encodeURIComponent(queryParams.nomeCompleto)}`);
      }
      if (queryParams.nome) {
        params.push(`nome=${encodeURIComponent(queryParams.nome)}`);
      }
      if (queryParams.cognome) {
        params.push(`cognome=${encodeURIComponent(queryParams.cognome)}`);
      }
      if (queryParams.data) {
        params.push(`data=${encodeURIComponent(queryParams.data)}`);
      }

      if (params.length > 0) {
        url += '?' + params.join('&');
      }
    }

    return this.http.get<Prenotazione[]>(url);
  }

  salva(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.apiUrl}/${prenotazione.id}`, prenotazione);
  }

  cancella(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
