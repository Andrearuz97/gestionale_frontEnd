import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:9090/api/clienti';

  constructor(private http: HttpClient) {}

  getAll(filtro?: string): Observable<Cliente[]> {
    let url = this.apiUrl;

    if (filtro && filtro.trim() !== '') {
      const encoded = encodeURIComponent(filtro.trim());
      url += `?filtro=${encoded}`;
    }

    return this.http.get<Cliente[]>(url);
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  aggiornaCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  creaCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  promuoviAUtente(dto: {
    clienteId: number;
    password: string;
  }): Observable<any> {
    return this.http.post(
      `http://localhost:9090/api/clienti/${dto.clienteId}/promuovi-a-utente`,
      { password: dto.password },
      { responseType: 'text' as 'json' } // 👈 così Angular accetta una stringa come risposta
    );
  }

  downgradeUtente(clienteId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${clienteId}/revoca-utente`,
      null, // PUT senza corpo
      { responseType: 'text' as 'json' }
    );
  }

  riattivaUtente(clienteId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clienteId}/riattiva-utente`, null, {
      responseType: 'text' as 'json',
    });
  }
}
