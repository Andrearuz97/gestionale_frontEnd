import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
})
export class ClientiComponent implements OnInit {
  clienti: Cliente[] = [];
  clientiFiltrati: Cliente[] = [];
  filtro: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.caricaClienti();
  }

  caricaClienti(query?: string) {
    this.clienteService.getAll(query).subscribe(data => {
      this.clienti = data.map(c => ({
        ...c,
        editing: false,
        dataNascita: c.dataNascita ? c.dataNascita.substring(0, 10) : ''
      }));
      this.clientiFiltrati = [...this.clienti];
    });
  }

  applicaFiltro() {
    this.caricaClienti(this.filtro);
  }

  resetFiltro() {
    this.filtro = '';
    this.caricaClienti();
  }

  salvaCliente(cliente: Cliente) {
    if (!cliente.id) {
      alert("❌ Errore: ID cliente mancante!");
      return;
    }

    const clientePulito = {
      nome: cliente.nome,
      cognome: cliente.cognome,
      email: cliente.email,
      telefono: cliente.telefono,
      dataNascita: cliente.dataNascita
    };

    this.clienteService.aggiornaCliente(cliente.id, clientePulito).subscribe({
      next: () => {
        cliente.editing = false;
        this.applicaFiltro();
      },
      error: (err) => {
        console.error("Errore PUT:", err);
        alert("❌ Errore durante il salvataggio del cliente.");
      }
    });
  }

  eliminaCliente(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
      this.clienteService.delete(id).subscribe(() => {
        this.caricaClienti();
      });
    }
  }
}
