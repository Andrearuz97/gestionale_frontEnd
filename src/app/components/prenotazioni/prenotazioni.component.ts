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
  orariOccupati: string[] = [];

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
    this.caricaTrattamenti();
    this.caricaPrenotazioni();
    this.generaOrari();
  }

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

  caricaPrenotazioni(): void {
    this.loading = true;
    this.error = '';

    const params = {
      filtro: this.filtroNome,
      data: this.filtroData,
    };

    this.prenotazioniService.getPrenotazioni(params).subscribe({
      next: (data) => {
        this.prenotazioni = data.map((p) => ({
          ...p,
          editing: false,
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento delle prenotazioni';
        this.loading = false;
      },
    });
  }

  caricaTrattamenti(): void {
    this.http
      .get<Trattamento[]>('http://localhost:9090/api/trattamenti')
      .subscribe((data) => (this.trattamenti = data));
  }

  cercaClienti(): void {
    if (this.searchQuery.trim().length < 2) {
      this.clientiFiltrati = [];
      this.showDropdown = false;
      return;
    }

    this.http
      .get<Cliente[]>(
        `http://localhost:9090/api/clienti?filtro=${this.searchQuery.trim()}`
      )
      .subscribe((data) => {
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

  caricaOrariOccupati(): void {
    if (!this.nuovaPrenotazione.data) {
      this.orariOccupati = [];
      return;
    }

    const dataSelezionata = this.nuovaPrenotazione.data;

    this.http
      .get<Prenotazione[]>(
        `http://localhost:9090/api/prenotazioni?filtro=${dataSelezionata}`
      )
      .subscribe({
        next: (data) => {
          this.orariOccupati = data.map((p) =>
            p.dataOra.split('T')[1].substring(0, 5)
          );
        },
      });
  }

  selezionaOrario(orario: string): void {
    if (!this.orariOccupati.includes(orario)) {
      this.nuovaPrenotazione.orario = orario;
    }
  }

  salvaPrenotazioneForm(): void {
    const { clienteId, trattamentoId, data, orario, note } =
      this.nuovaPrenotazione;

    if (!clienteId || !trattamentoId || !data || !orario) {
      this.messaggio = '❌ Compila tutti i campi obbligatori.';
      setTimeout(() => (this.messaggio = ''), 3000);
      return;
    }

    const dataOra = `${data}T${orario}`;

    this.http
      .post<boolean>(
        'http://localhost:9090/api/prenotazioni/controlla-disponibilita',
        {
          trattamentoId,
          dataOra,
        }
      )
      .subscribe({
        next: (disponibile) => {
          if (disponibile) {
            const payload = { clienteId, trattamentoId, dataOra, note };
            this.prenotazioniService.creaPrenotazione(payload).subscribe({
              next: () => {
                this.messaggio = '✅ Prenotazione salvata con successo!';
                setTimeout(() => (this.messaggio = ''), 3000);
                this.resetForm();
                this.caricaPrenotazioni();
              },
              error: () => {
                this.messaggio = '❌ Errore durante il salvataggio.';
                setTimeout(() => (this.messaggio = ''), 3000);
              },
            });
          } else {
            this.messaggio = '❌ Orario già occupato! Scegli un altro slot.';
            setTimeout(() => (this.messaggio = ''), 4000);
          }
        },
        error: () => {
          this.messaggio = '❌ Errore nel controllo disponibilità.';
          setTimeout(() => (this.messaggio = ''), 3000);
        },
      });
  }

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
    this.orariOccupati = [];
  }

  aggiornaStatoPrenotazione(p: Prenotazione): void {
    this.salvaPrenotazione(p);
  }

  applicaFiltri(): void {
    this.loading = true;
    this.error = '';

    const testo = this.filtroNome.trim();
    const data = this.formatData(this.filtroData);

    const params = {
      filtro: testo,
      data: data,
    };

    this.prenotazioniService.getPrenotazioni(params).subscribe({
      next: (dataRicevuta) => {
        if (dataRicevuta && dataRicevuta.length > 0) {
          this.prenotazioni = dataRicevuta.filter((p) =>
            p.dataOra.startsWith(data)
          );
          this.prenotazioni = this.prenotazioni.map((p) => ({
            ...p,
            editing: false,
          }));
        } else {
          this.prenotazioni = [];
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

  formatData(data: string): string {
    if (data) {
      const date = new Date(data);
      return date.toISOString().split('T')[0];
    }
    return '';
  }

  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }

  salvaPrenotazione(p: Prenotazione): void {
    const dataOra = p.dataOra;
    const trattamentoId = p.trattamento.id;
    const prenotazioneId = p.id;

    this.http
      .post<boolean>(
        'http://localhost:9090/api/prenotazioni/controlla-disponibilita',
        {
          dataOra,
          trattamentoId,
          prenotazioneId,
        }
      )
      .subscribe({
        next: (disponibile) => {
          if (disponibile) {
            const dto = {
              dataOra: p.dataOra,
              trattamentoId: p.trattamento.id,
              clienteId: p.cliente.id,
              nome: p.cliente.nome,
              cognome: p.cliente.cognome,
              telefono: p.cliente.telefono,
              email: p.cliente.email,
              dataNascita: p.cliente.dataNascita,
              stato: p.stato,
              note: p.note,
              dataPrenotazione: p.dataPrenotazione,
            };

            this.http
              .put<Prenotazione>(
                `http://localhost:9090/api/prenotazioni/${p.id}`,
                dto
              )
              .subscribe(() => {
                this.messaggio = '✅ Modifiche salvate!';
                setTimeout(() => (this.messaggio = ''), 3000);
                this.caricaPrenotazioni();
              });
          } else {
            this.messaggio = '❌ Orario occupato! Impossibile salvare.';
            setTimeout(() => (this.messaggio = ''), 4000);
          }
        },
        error: () => {
          this.messaggio = '❌ Errore nel controllo disponibilità.';
          setTimeout(() => (this.messaggio = ''), 3000);
        },
      });
  }

  cancellaPrenotazione(id: number): void {
    if (confirm('Sicuro di voler eliminare questa prenotazione?')) {
      this.prenotazioniService
        .cancella(id)
        .subscribe(() => this.caricaPrenotazioni());
    }
  }

  apriDettagli(p: Prenotazione): void {
    this.prenotazioneDettaglio = p;
  }

  slotDisponibili: string[] = [];

  calcolaSlotDisponibili() {
    this.slotDisponibili = [];

    if (!this.nuovaPrenotazione.data || !this.nuovaPrenotazione.trattamentoId) {
      console.warn('⛔ Data o trattamento non selezionati');
      return;
    }

    const trattamento = this.trattamenti.find(
      (t) => t.id === Number(this.nuovaPrenotazione.trattamentoId)
    );

    if (!trattamento) {
      console.error('⛔ Trattamento non trovato nel frontend');
      return;
    }

    const durata = trattamento.durata;
    const startMin = 9 * 60;
    const endMin = 17 * 60 + 30;

    const data = this.nuovaPrenotazione.data;

    this.http
      .get<Prenotazione[]>(
        `http://localhost:9090/api/prenotazioni?filtro=${data}`
      )
      .subscribe({
        next: (prenotazioni) => {
          console.log('📅 Prenotazioni del giorno:', prenotazioni);

          const occupati: { start: number; end: number }[] = prenotazioni.map(
            (p) => {
              const orario = p.dataOra.substring(11, 16);
              const [h, m] = orario.split(':').map(Number);
              const tratt = this.trattamenti.find(
                (t) => t.id === p.trattamento?.id
              );
              const durataPren = tratt?.durata || 30;
              const inizio = h * 60 + m;
              return { start: inizio, end: inizio + durataPren };
            }
          );

          console.log('⛔ Fasce orarie occupate:', occupati);

          const slots: string[] = [];

          for (let min = startMin; min <= endMin - durata; min += 5) {
            const overlap = occupati.some(
              (r) => min < r.end && min + durata > r.start
            );
            if (!overlap) {
              const ore = Math.floor(min / 60)
                .toString()
                .padStart(2, '0');
              const minuti = (min % 60).toString().padStart(2, '0');
              slots.push(`${ore}:${minuti}`);
            }
          }

          console.log('✅ Slot liberi generati:', slots);
          this.slotDisponibili = slots;
        },
        error: (err) => {
          console.error('❌ Errore nel caricamento prenotazioni:', err);
        },
      });
  }
}
