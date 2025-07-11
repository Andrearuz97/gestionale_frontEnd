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

  // Ottieni prenotazioni con i filtri
  getPrenotazioni(queryParams?: { filtro?: string }): Observable<Prenotazione[]> {
  let url = this.apiUrl;

  if (queryParams?.filtro) {
    const params = `filtro=${encodeURIComponent(queryParams.filtro)}`;
    url += `?${params}`;
  }

  console.log('Richiesta GET inviata a:', url);  // Aggiungi questo log per vedere l'URL completo

  return this.http.get<Prenotazione[]>(url);
}

  // Crea una nuova prenotazione (DTO parziale)
  creaPrenotazione(dto: {
    clienteId: number;
    trattamentoId: number;
    dataOra: string;
    note?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  // Salva una prenotazione esistente
  salvaPrenotazione(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.apiUrl}/${prenotazione.id}`, prenotazione);
  }

  // Cancella una prenotazione
  cancella(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ricerca per nome (solo per prenotazioni)
 ricerca(query: string): Observable<Prenotazione[]> {
    if (!query) return this.http.get<Prenotazione[]>(this.apiUrl); // restituisci tutte le prenotazioni se il filtro è vuoto
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/ricerca?query=${encodeURIComponent(query)}`);
}

}
