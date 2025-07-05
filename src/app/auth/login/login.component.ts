import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.authService.saveUserData(res.nome);
        this.successMessage = 'Login effettuato con successo!';
        setTimeout(() => this.router.navigate(['/dashboard']), 1200);
      },
      error: () => {
        this.errorMessage = 'Credenziali non valide.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
