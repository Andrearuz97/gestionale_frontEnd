import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  nome = '';
  cognome = '';
  email = '';
  telefono = '';
  dataNascita: string = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const payload: any = {
      nome: this.nome,
      cognome: this.cognome,
      email: this.email,
      telefono: this.telefono,
      password: this.password
    };

    if (this.dataNascita) {
      payload.dataNascita = this.dataNascita;
    }

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = '✅ Registrazione avvenuta con successo!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.errorMessage = '❌ Errore durante la registrazione.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
