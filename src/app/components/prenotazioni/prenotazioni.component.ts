import { Component, OnInit } from '@angular/core';
import { Prenotazione } from 'src/app/interfaces/prenotazione';
import { PrenotazioniService } from 'src/app/services/prenotazioni.service';
import { HttpClient } from '@angular/common/http';
import { Trattamento } from 'src/app/interfaces/trattamento';
import { Cliente } from 'src/app/interfaces/cliente';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
})
export class PrenotazioniComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  loading = false;
  error = '';
  filtroNome: string = ''; // Variabile per filtro nome
  filtroData: string = ''; // Variabile per filtro data
  prenotazioneDettaglio: Prenotazione | null = null;
  statiPossibili = ['CREATA', 'CONFERMATA', 'COMPLETATA', 'ANNULLATA'];

  mostraForm = false;
  trattamenti: Trattamento[] = [];
  clientiFiltrati: Cliente[] = [];
  clienteSelezionato: Cliente | null = null;
  searchQuery = ''; // Ricerca del cliente
  showDropdown = false;
  messaggio = ''; // Messaggio di errore o successo
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
    note: '',
  };

  constructor(
    private prenotazioniService: PrenotazioniService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.caricaPrenotazioni(); // Carica prenotazioni all'inizio
    this.caricaTrattamenti();
    this.generaOrari();
  }

  // Funzione per generare gli orari disponibili
  generaOrari(): void {
    const start = 8 * 60;
    const end = 20 * 60;
    const intervallo = 5;
    const orari: string[] = [];

    for (let minuti = start; minuti <= end; minuti += intervallo) {
      const ore = Math.floor(minuti / 60)
        .toString()
        .padStart(2, '0');
      const min = (minuti % 60).toString().padStart(2, '0');
      orari.push(`${ore}:${min}`);
    }

    this.orariDisponibili = orari;
  }

  // Funzione per caricare le prenotazioni con il filtro
  caricaPrenotazioni(): void {
    this.loading = true;
    this.error = '';

    const params = {
      filtro: this.filtroNome, // Filtro per nome
      data: this.filtroData, // Filtro per data
    };

    this.prenotazioniService.getPrenotazioni(params).subscribe({
      next: (data) => {
        this.prenotazioni = data.map((p) => ({
          ...p,
          editing: false, // Aggiungi la logica per la modifica
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento delle prenotazioni';
        this.loading = false;
      },
    });
  }

  // Funzione per caricare i trattamenti
  caricaTrattamenti(): void {
    this.http
      .get<Trattamento[]>('http://localhost:9090/api/trattamenti')
      .subscribe((data) => (this.trattamenti = data));
  }

  // Funzione per cercare i clienti
  cercaClienti(): void {
    if (this.searchQuery.trim().length < 2) {
      // Se la ricerca è troppo corta, non fare nulla
      this.clientiFiltrati = [];
      this.showDropdown = false;
      return;
    }

    // Chiamata al backend per cercare i clienti
    this.http
      .get<Cliente[]>(
        `http://localhost:9090/api/clienti?filtro=${this.searchQuery.trim()}`
      )
      .subscribe((data) => {
        // Assegna i risultati della ricerca alla variabile
        this.clientiFiltrati = data;
        this.showDropdown = true; // Mostra il dropdown con i risultati
      });
  }

  // Funzione per selezionare il cliente dalla lista
  selezionaCliente(cliente: Cliente): void {
    this.clienteSelezionato = cliente;
    this.nuovaPrenotazione.clienteId = cliente.id;
    this.searchQuery = `${cliente.nome} ${cliente.cognome}`;
    this.showDropdown = false;
  }

  // Funzione per nascondere la lista dei dropdown
  nascondiDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }

  // Funzione per salvare una prenotazione tramite il form
  salvaPrenotazioneForm(): void {
    const { clienteId, trattamentoId, data, orario, note } =
      this.nuovaPrenotazione;

    if (!clienteId || !trattamentoId || !data || !orario) {
      this.messaggio = '❌ Compila tutti i campi obbligatori.';
      setTimeout(() => (this.messaggio = ''), 3000);
      return;
    }

    const dataOra = `${data}T${orario}`;

    const payload = {
      clienteId,
      trattamentoId,
      dataOra,
      note,
    };

    this.prenotazioniService.creaPrenotazione(payload).subscribe({
      next: () => {
        this.messaggio = '✅ Prenotazione salvata con successo!';
        setTimeout(() => (this.messaggio = ''), 3000);
        this.resetForm();
        this.caricaPrenotazioni(); // Mostra la nuova prenotazione
      },
      error: () => {
        this.messaggio = '❌ Errore durante il salvataggio.';
        setTimeout(() => (this.messaggio = ''), 3000);
      },
    });
  }

  // Funzione per resettare il form
  resetForm(): void {
    this.nuovaPrenotazione = {
      clienteId: null,
      trattamentoId: null,
      data: '',
      orario: '',
      note: '',
    };
    this.clienteSelezionato = null;
    this.searchQuery = '';
    this.clientiFiltrati = [];
    this.mostraForm = false;
  }

  // Funzione per aggiornare lo stato della prenotazione
  aggiornaStatoPrenotazione(p: Prenotazione): void {
    this.salvaPrenotazione(p);
  }

  // Funzione per applicare i filtri (nome e data)
  applicaFiltri(): void {
    this.loading = true;
    this.error = '';

    const testo = this.filtroNome.trim(); // Filtro per nome
    const data = this.formatData(this.filtroData); // Filtro per data formattato correttamente

    console.log('Filtro applicato:', { filtro: testo, data: data }); // Log dei parametri inviati al backend

    const params = {
      filtro: testo, // Filtro per nome
      data: data, // Filtro per data formattata
    };

    this.prenotazioniService.getPrenotazioni(params).subscribe({
      next: (dataRicevuta) => {
        console.log('Dati ricevuti:', dataRicevuta); // Log per vedere i dati ricevuti

        if (dataRicevuta && dataRicevuta.length > 0) {
          // Filtra prenotazioni in base alla data (solo anno, mese, giorno)
          this.prenotazioni = dataRicevuta.filter((p) =>
            p.dataOra.startsWith(data)
          ); // Confronta solo la parte della data
          this.prenotazioni = this.prenotazioni.map((p) => ({
            ...p,
            editing: false,
          }));
        } else {
          this.prenotazioni = []; // Se non ci sono prenotazioni, svuotiamo la lista
          this.error = 'Nessuna prenotazione trovata per la data specificata';
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel filtraggio per data';
        this.loading = false;
      },
    });
  }

  // Funzione per formattare la data nel formato 'yyyy-MM-dd'
  formatData(data: string): string {
    if (data) {
      const date = new Date(data); // Crea un oggetto Date
      return date.toISOString().split('T')[0]; // Restituisce solo la parte della data (yyyy-MM-dd)
    }
    return ''; // Restituisce una stringa vuota se la data non è valida
  }

  // Funzione per reset dei filtri
  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }

  // Funzione per salvare una prenotazione aggiornata
  salvaPrenotazione(p: Prenotazione): void {
    this.prenotazioniService.salvaPrenotazione(p).subscribe();
  }

  // Funzione per cancellare una prenotazione
  cancellaPrenotazione(id: number): void {
    if (confirm('Sicuro di voler eliminare questa prenotazione?')) {
      this.prenotazioniService
        .cancella(id)
        .subscribe(() => this.caricaPrenotazioni());
    }
  }

  // Funzione per aprire i dettagli della prenotazione
  apriDettagli(p: Prenotazione): void {
    this.prenotazioneDettaglio = p;
  }
}
