import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
})
export class ClientiComponent implements OnInit {
  clienti: Cliente[] = [];
  filtro: string = '';

  nuovoClienteVisibile: boolean = false;

  nuovoCliente: Partial<Cliente> = {
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    dataNascita: '',
    note: ''
  };
  erroreCreazione = '';

  emailUtente: string = '';
  passwordUtente: string = '';
  clienteDaPromuovere: Cliente | null = null;

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
    const clientePulito = {
      nome: cliente.nome,
      cognome: cliente.cognome,
      email: cliente.email,
      telefono: cliente.telefono,
      dataNascita: cliente.dataNascita,
      note: cliente.note
    };

    this.clienteService.aggiornaCliente(cliente.id!, clientePulito).subscribe({
      next: () => {
        cliente.editing = false;
        this.caricaClienti();
      },
      error: () => alert("❌ Errore durante il salvataggio.")
    });
  }

  eliminaCliente(id: number) {
    if (confirm('Vuoi eliminare questo cliente?')) {
      this.clienteService.delete(id).subscribe(() => this.caricaClienti());
    }
  }

  creaCliente() {
    const { nome, cognome, email, telefono, dataNascita } = this.nuovoCliente;
    this.erroreCreazione = '';

    if (!nome || !cognome || !email || !telefono || !dataNascita) {
      this.erroreCreazione = 'Compila tutti i campi obbligatori.';
      return;
    }

    this.clienteService.creaCliente(this.nuovoCliente as Cliente).subscribe({
      next: () => {
        this.nuovoCliente = { nome: '', cognome: '', email: '', telefono: '', dataNascita: '', note: '' };
        this.nuovoClienteVisibile = false;
        this.caricaClienti();
      },
      error: () => {
        this.erroreCreazione = 'Errore durante la creazione. Controlla i dati.';
      }
    });
  }

  // 🚀 Promozione
  promuoviAClienteUtente(cliente: Cliente) {
    this.emailUtente = cliente.email;
    this.passwordUtente = '';
    this.clienteDaPromuovere = cliente;

    // Apertura modale con fallback per evitare errori con bootstrap
    const modalElement = document.getElementById('modalPromuovi');
    if (modalElement) {
      // @ts-ignore
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  promuovi() {
    if (!this.clienteDaPromuovere || !this.passwordUtente) return;

    const payload = {
      clienteId: this.clienteDaPromuovere.id!,
      email: this.clienteDaPromuovere.email,
      password: this.passwordUtente
    };

    this.clienteService.promuoviAUtente(payload).subscribe({
      next: () => {
        const modalElement = document.getElementById('modalPromuovi');
        if (modalElement) {
          // @ts-ignore
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }

        alert("✅ Cliente promosso a utente!");
        this.caricaClienti();
      },
      error: () => alert("❌ Errore nella promozione.")
    });
  }

  downgradeUtente(cliente: Cliente) {
    if (confirm("Vuoi davvero rimuovere l'utente associato? Il cliente resterà.")) {
      this.clienteService.downgradeUtente(cliente.id!).subscribe({
        next: () => {
          alert("✅ Utente rimosso correttamente.");
          this.caricaClienti();
        },
        error: () => alert("❌ Errore durante il downgrade.")
      });
    }
  }

  riattivaUtente(cliente: Cliente) {
    if (confirm("Vuoi riattivare l'utente associato a questo cliente?")) {
      this.clienteService.riattivaUtente(cliente.id!).subscribe({
        next: () => {
          alert("✅ Utente riattivato correttamente.");
          this.caricaClienti();
        },
        error: () => alert("❌ Errore durante la riattivazione.")
      });
    }
  }
}
