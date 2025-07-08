import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  nome: string;
  cognome: string;
  telefono?: string;
  email?: string;
  dataNascita?: string;
}

export interface Trattamento {
  id: number;
  nome: string;
  prezzo?: number;
  durata?: number;
  dataCreazione?: string;
}

export interface Prenotazione {
  id: number;
  dataOra: string;
  stato: string;
  note?: string;
  trattamento: Trattamento;
  cliente: Cliente;
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

  salva(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.apiUrl}/${prenotazione.id}`, prenotazione);
  }

  cancella(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
