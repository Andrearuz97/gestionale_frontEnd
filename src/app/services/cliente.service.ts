import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:9090/api/clienti';

  constructor(private http: HttpClient) {}

getAll(filtro?: string): Observable<Cliente[]> {
  let url = this.apiUrl;

  if (filtro) {
    const trimmed = filtro.trim();
    const encoded = encodeURIComponent(trimmed);

    if (trimmed.includes(' ')) {
      // Caso nome + cognome (es: "Mario Rossi")
      url += `?nomeCompleto=${encoded}`;
    } else {
      // Caso solo nome o solo cognome
      url += `?nome=${encoded}`;  // solo nome, backend cercherà anche per cognome
    }
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
}
