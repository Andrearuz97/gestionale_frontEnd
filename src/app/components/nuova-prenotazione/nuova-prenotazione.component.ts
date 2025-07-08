import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Trattamento {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-nuova-prenotazione',
  templateUrl: './nuova-prenotazione.component.html',
  styleUrls: ['./nuova-prenotazione.component.scss']
})
export class NuovaPrenotazioneComponent implements OnInit {
  trattamenti: Trattamento[] = [];

  prenotazione = {
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    dataNascita: '',
    dataOra: '',
    trattamentoId: null,
    note: ''
  };

  messaggio = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Trattamento[]>('http://localhost:9090/api/trattamenti')
      .subscribe(data => this.trattamenti = data);
  }

  salvaPrenotazione(): void {
    this.http.post('http://localhost:9090/api/prenotazioni', this.prenotazione)
      .subscribe(() => {
        this.messaggio = '✅ Prenotazione salvata con successo!';
        this.prenotazione = {
          nome: '', cognome: '', telefono: '', email: '',
          dataNascita: '', dataOra: '', trattamentoId: null, note: ''
        };
      });
  }
}
