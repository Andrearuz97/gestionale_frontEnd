import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trattamento } from '../interfaces/trattamento';

@Injectable({
  providedIn: 'root'
})
export class TrattamentiService {
  private apiUrl = 'http://localhost:9090/api/trattamenti';

  constructor(private http: HttpClient) {}

  getTrattamenti(): Observable<Trattamento[]> {
    return this.http.get<Trattamento[]>(this.apiUrl);
  }

  creaTrattamento(trattamento: Partial<Trattamento>): Observable<Trattamento> {
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

  disattivaTrattamento(id: number): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/${id}/disattiva`, {});
}

attivaTrattamento(id: number): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/${id}/attiva`, {});
}

cercaTrattamenti(nome: string): Observable<Trattamento[]> {
  return this.http.get<Trattamento[]>(`${this.apiUrl}/cerca?nome=${encodeURIComponent(nome)}`);
}


}
