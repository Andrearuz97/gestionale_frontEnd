import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trattamento } from 'src/app/interfaces/trattamento';

interface Cliente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita: string;
}

@Component({
  selector: 'app-nuova-prenotazione',
  templateUrl: './nuova-prenotazione.component.html',
  styleUrls: ['./nuova-prenotazione.component.scss']
})
export class NuovaPrenotazioneComponent implements OnInit {
  trattamenti: Trattamento[] = [];
  clientiFiltrati: Cliente[] = [];
  clienteSelezionato: Cliente | null = null;

  searchQuery: string = '';
  showDropdown = false;
  clienteEsistente = true;

  messaggio = '';

  prenotazione: any = {
    clienteId: null,
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    dataNascita: '',
    dataOra: '',
    trattamentoId: null,
    note: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Trattamento[]>('http://localhost:9090/api/trattamenti')
      .subscribe(data => this.trattamenti = data);
  }

  cercaClienti(): void {
    if (this.searchQuery.trim().length < 2) {
      this.clientiFiltrati = [];
      return;
    }

    this.http.get<Cliente[]>(`http://localhost:9090/api/clienti?nomeCompleto=${this.searchQuery}`)
      .subscribe(data => {
        this.clientiFiltrati = data;
        this.showDropdown = true;
      });
  }

  selezionaCliente(cliente: Cliente): void {
    this.clienteSelezionato = cliente;
    this.prenotazione.clienteId = cliente.id;
    this.searchQuery = `${cliente.nome} ${cliente.cognome}`;
    this.showDropdown = false;
  }

  nascondiDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150); // ritardo per consentire click su dropdown
  }

  salvaPrenotazione(): void {
    // Se cliente nuovo, rimuove clienteId
    if (!this.clienteEsistente) {
      this.prenotazione.clienteId = null;
    }

    this.http.post('http://localhost:9090/api/prenotazioni', this.prenotazione)
      .subscribe(() => {
        this.messaggio = '✅ Prenotazione salvata con successo!';
        this.resetForm();
      });
  }

  resetForm(): void {
    this.prenotazione = {
      clienteId: null,
      nome: '',
      cognome: '',
      telefono: '',
      email: '',
      dataNascita: '',
      dataOra: '',
      trattamentoId: null,
      note: ''
    };
    this.searchQuery = '';
    this.clienteSelezionato = null;
    this.clienteEsistente = true;
    this.clientiFiltrati = [];
  }
}
