import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trattamento {
  id: number;
  nome: string;
  prezzo: number;
  durata: number;
  dataCreazione: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrattamentiService {
  private apiUrl = 'http://localhost:9090/api/trattamenti';

  constructor(private http: HttpClient) {}

  getTrattamenti(): Observable<Trattamento[]> {
    return this.http.get<Trattamento[]>(this.apiUrl);
  }

  creaTrattamento(trattamento: Trattamento): Observable<Trattamento> {
    return this.http.post<Trattamento>(this.apiUrl, trattamento);
  }

  aggiornaTrattamento(id: number, trattamento: Trattamento): Observable<Trattamento> {
    return this.http.put<Trattamento>(`${this.apiUrl}/${id}`, trattamento);
  }

  cancellaTrattamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTrattamentoById(id: number): Observable<Trattamento> {
    return this.http.get<Trattamento>(`${this.apiUrl}/${id}`);
  }
}
