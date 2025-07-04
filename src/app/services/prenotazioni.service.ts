import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trattamento {
  id: number;
  nome: string;
}

export interface Prenotazione {
  id: number;
  nome: string;             // CAMPO CORRETTO
  dataOra: string;          // CAMPO CORRETTO
  trattamento: Trattamento;
  stato: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrenotazioniService {
  private apiUrl = 'http://localhost:9090/api/prenotazioni';

  constructor(private http: HttpClient) {}

  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(this.apiUrl);
  }

  aggiornaStato(id: number, stato: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/stato`, { stato });
  }
}
