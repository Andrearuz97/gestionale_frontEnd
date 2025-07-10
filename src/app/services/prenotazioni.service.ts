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

  getPrenotazioni(queryParams?: {
    nome?: string;
    cognome?: string;
    nomeCompleto?: string;
    data?: string;
    telefono?: string;
    email?: string;
    dataNascita?: string;
  }): Observable<Prenotazione[]> {
    let url = this.apiUrl;

    if (queryParams) {
      const params = [];

      if (queryParams.nomeCompleto) params.push(`nomeCompleto=${encodeURIComponent(queryParams.nomeCompleto)}`);
      if (queryParams.nome) params.push(`nome=${encodeURIComponent(queryParams.nome)}`);
      if (queryParams.cognome) params.push(`cognome=${encodeURIComponent(queryParams.cognome)}`);
      if (queryParams.data) params.push(`data=${encodeURIComponent(queryParams.data)}`);
      if (queryParams.telefono) params.push(`telefono=${encodeURIComponent(queryParams.telefono)}`);
      if (queryParams.email) params.push(`email=${encodeURIComponent(queryParams.email)}`);
      if (queryParams.dataNascita) params.push(`dataNascita=${encodeURIComponent(queryParams.dataNascita)}`);

      if (params.length > 0) {
        url += '?' + params.join('&');
      }
    }

    return this.http.get<Prenotazione[]>(url);
  }

  // ✅ Crea nuova prenotazione (DTO parziale)
  creaPrenotazione(dto: {
  clienteId: number;
  trattamentoId: number;
  dataOra: string; // <-- invece di data + orario
  note?: string;
}): Observable<any> {
  return this.http.post<any>(this.apiUrl, dto);
}


  // ✅ Salva modifica prenotazione esistente (entità completa)
  salvaPrenotazione(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.apiUrl}/${prenotazione.id}`, prenotazione);
  }

  cancella(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  ricerca(query: string): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/ricerca?query=${encodeURIComponent(query)}`);
  }
}
