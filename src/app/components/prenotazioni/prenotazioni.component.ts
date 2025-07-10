import { Component, OnInit } from '@angular/core';
import { Prenotazione } from 'src/app/interfaces/prenotazione';
import { PrenotazioniService } from 'src/app/services/prenotazioni.service';
import { HttpClient } from '@angular/common/http';
import { Trattamento } from 'src/app/interfaces/trattamento';
import { Cliente } from 'src/app/interfaces/cliente';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html'
})
export class PrenotazioniComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  loading = false;
  error = '';
  filtroNome: string = '';
  filtroData: string = '';
  prenotazioneDettaglio: Prenotazione | null = null;
  statiPossibili = ['CREATA', 'CONFERMATA', 'COMPLETATA', 'ANNULLATA'];

  mostraForm = false;
  trattamenti: Trattamento[] = [];
  clientiFiltrati: Cliente[] = [];
  clienteSelezionato: Cliente | null = null;
  searchQuery = '';
  showDropdown = false;
  messaggio = '';
  orariDisponibili: string[] = [];

  nuovaPrenotazione: {
    clienteId: number | null;
    trattamentoId: number | null;
    data: string;
    orario: string;
    note?: string;
  } = {
    clienteId: null,
    trattamentoId: null,
    data: '',
    orario: '',
    note: ''
  };

  constructor(private prenotazioniService: PrenotazioniService, private http: HttpClient) {}

  ngOnInit(): void {
    this.caricaPrenotazioni();
    this.caricaTrattamenti();
    this.generaOrari();
  }

  generaOrari(): void {
    const start = 8 * 60;
    const end = 20 * 60;
    const intervallo = 5;
    const orari: string[] = [];

    for (let minuti = start; minuti <= end; minuti += intervallo) {
      const ore = Math.floor(minuti / 60).toString().padStart(2, '0');
      const min = (minuti % 60).toString().padStart(2, '0');
      orari.push(`${ore}:${min}`);
    }

    this.orariDisponibili = orari;
  }

  caricaPrenotazioni(): void {
  this.loading = true;
  this.error = '';

  this.prenotazioniService.getPrenotazioni().subscribe({
    next: data => {
      this.prenotazioni = data.map(p => ({
        ...p,
        editing: false // NON tocchiamo dataPrenotazione!
      }));
      this.loading = false;
    },
    error: () => {
      this.error = 'Errore nel caricamento delle prenotazioni';
      this.loading = false;
    }
  });
}



  caricaTrattamenti(): void {
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
    this.nuovaPrenotazione.clienteId = cliente.id;
    this.searchQuery = `${cliente.nome} ${cliente.cognome}`;
    this.showDropdown = false;
  }

  nascondiDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }

 salvaPrenotazioneForm(): void {
  const { clienteId, trattamentoId, data, orario, note } = this.nuovaPrenotazione;

  if (!clienteId || !trattamentoId || !data || !orario) {
    this.messaggio = '❌ Compila tutti i campi obbligatori.';
    setTimeout(() => this.messaggio = '', 3000);
    return;
  }

  const dataOra = `${data}T${orario}`;

  const payload = {
    clienteId,
    trattamentoId,
    dataOra,
    note
  };

  this.prenotazioniService.creaPrenotazione(payload).subscribe({
    next: () => {
      this.messaggio = '✅ Prenotazione salvata con successo!';
      setTimeout(() => this.messaggio = '', 3000);
      this.resetForm();
      this.caricaPrenotazioni(); // mostra la nuova prenotazione, incluso dataPrenotazione
    },
    error: () => {
      this.messaggio = '❌ Errore durante il salvataggio.';
      setTimeout(() => this.messaggio = '', 3000);
    }
  });
}




  resetForm(): void {
    this.nuovaPrenotazione = {
      clienteId: null,
      trattamentoId: null,
      data: '',
      orario: '',
      note: ''
    };
    this.clienteSelezionato = null;
    this.searchQuery = '';
    this.clientiFiltrati = [];
    this.mostraForm = false;
  }

  aggiornaStatoPrenotazione(p: Prenotazione): void {
    this.salvaPrenotazione(p);
  }

  applicaFiltri(): void {
    this.loading = true;
    this.error = '';
    const testo = this.filtroNome.trim();
    const data = this.filtroData;

    if (testo) {
      this.prenotazioniService.ricerca(testo).subscribe({
        next: dataRicevuta => {
          this.prenotazioni = data
            ? dataRicevuta.filter(p => p.dataPrenotazione?.startsWith(data))
            : dataRicevuta;
          this.prenotazioni = this.prenotazioni.map(p => ({ ...p, editing: false }));
          this.loading = false;
        },
        error: () => {
          this.error = 'Errore nella ricerca';
          this.loading = false;
        }
      });
    } else if (data) {
      this.prenotazioniService.getPrenotazioni({ data }).subscribe({
        next: dataRicevuta => {
          this.prenotazioni = dataRicevuta.map(p => ({ ...p, editing: false }));
          this.loading = false;
        },
        error: () => {
          this.error = 'Errore nel filtraggio per data';
          this.loading = false;
        }
      });
    } else {
      this.caricaPrenotazioni();
    }
  }

  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }

  salvaPrenotazione(p: Prenotazione): void {
    this.prenotazioniService.salvaPrenotazione(p).subscribe();
  }

  cancellaPrenotazione(id: number): void {
    if (confirm('Sicuro di voler eliminare questa prenotazione?')) {
      this.prenotazioniService.cancella(id).subscribe(() => this.caricaPrenotazioni());
    }
  }

  apriDettagli(p: Prenotazione): void {
    this.prenotazioneDettaglio = p;
  }
}
