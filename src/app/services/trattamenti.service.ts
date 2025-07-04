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
}
