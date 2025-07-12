import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLogged = false;
  nomeUtente: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService
      .isLoggedIn()
      .subscribe((logged) => (this.isLogged = logged));
    this.authService
      .getUserName$()
      .subscribe((nome) => (this.nomeUtente = nome));
  }

  logout() {
    this.authService.logout();
  }
}
