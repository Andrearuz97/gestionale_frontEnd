// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/auth';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private nomeUtente$ = new BehaviorSubject<string | null>(this.getUserName());

  constructor(private http: HttpClient, private router: Router) {}

   login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }


  saveToken(token: string) {
    localStorage.setItem('jwt', token);
    this.loggedIn$.next(true);
  }

  saveUserData(nome: string) {
    localStorage.setItem('nomeUtente', nome);
    this.nomeUtente$.next(nome);
  }

  getUserName(): string | null {
    return localStorage.getItem('nomeUtente');
  }

  getUserName$() {
    return this.nomeUtente$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn() {
    return this.loggedIn$.asObservable();
  }

  hasToken(): boolean {
    return !!localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('nomeUtente');
    this.loggedIn$.next(false);
    this.nomeUtente$.next(null);
    this.router.navigate(['/login']);
  }
}
