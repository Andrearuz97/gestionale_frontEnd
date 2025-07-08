import { Component, OnInit } from '@angular/core';
import { PrenotazioniService } from '../../services/prenotazioni.service';
import { TrattamentiService } from '../../services/trattamenti.service';
import { Prenotazione } from 'src/app/interfaces/prenotazione';
import { Trattamento } from 'src/app/interfaces/trattamento';
import { Cliente } from 'src/app/interfaces/cliente';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.scss']
})
export class PrenotazioniComponent implements OnInit {
  prenotazioni: (Prenotazione & { editing?: boolean })[] = [];
  trattamenti: Trattamento[] = [];
  nomiClienti: string[] = [];
  filtroNome = '';
  filtroData = '';
  loading = false;
  error = '';
  statiPossibili = ['CREATA', 'CONFERMATA', 'ANNULLATA', 'COMPLETATA'];
  prenotazioneDettaglio: Prenotazione | null = null;

  constructor(
    private prenotazioniService: PrenotazioniService,
    private trattamentiService: TrattamentiService
  ) {}

  ngOnInit(): void {
    this.caricaPrenotazioni();
    this.caricaTrattamenti();
  }

  caricaPrenotazioni(): void {
    this.loading = true;
    this.prenotazioniService.getPrenotazioni().subscribe({
      next: data => {
        this.prenotazioni = data.map(p => ({
          ...p,
          editing: false,
          cliente: p.cliente ?? {
            id: 0,
            nome: '',
            cognome: '',
            telefono: '',
            email: '',
            dataNascita: ''
          }
        }));
        this.nomiClienti = [...new Set(this.prenotazioni.map(p => `${p.cliente.nome} ${p.cliente.cognome}`.trim()))];
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento delle prenotazioni';
        this.loading = false;
      }
    });
  }

  caricaTrattamenti(): void {
    this.trattamentiService.getTrattamenti().subscribe({
      next: data => this.trattamenti = data,
      error: err => console.error('Errore caricamento trattamenti', err)
    });
  }

  applicaFiltri(): void {
    this.loading = true;
    const nomeInserito = this.filtroNome.trim();
    const data = this.filtroData;
    let queryParams: any = {};

    if (nomeInserito.includes(' ')) {
      queryParams.nomeCompleto = nomeInserito;
    } else if (nomeInserito) {
      queryParams.nome = nomeInserito;
    }

    if (data) {
      queryParams.data = data;
    }

    this.prenotazioniService.getPrenotazioni(queryParams).subscribe({
      next: dataRisultati => {
        if (dataRisultati.length === 0 && nomeInserito && !nomeInserito.includes(' ')) {
          queryParams = { cognome: nomeInserito };
          if (data) queryParams.data = data;

          this.prenotazioniService.getPrenotazioni(queryParams).subscribe({
            next: fallback => this.aggiornaListaPrenotazioni(fallback),
            error: () => {
              this.error = 'Errore durante il filtro';
              this.loading = false;
            }
          });

          return;
        }
        this.aggiornaListaPrenotazioni(dataRisultati);
      },
      error: () => {
        this.error = 'Errore durante il filtro';
        this.loading = false;
      }
    });
  }

  private aggiornaListaPrenotazioni(prenotazioni: Prenotazione[]) {
    this.prenotazioni = prenotazioni.map(p => ({
      ...p,
      editing: false,
      cliente: p.cliente ?? {
        id: 0,
        nome: '',
        cognome: '',
        telefono: '',
        email: '',
        dataNascita: ''
      }
    }));
    this.loading = false;
  }

  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }

  salvaPrenotazione(p: Prenotazione & { editing?: boolean }) {
    const corpo = this.preparaPrenotazione(p);
    this.prenotazioniService.salva(corpo).subscribe({
      next: () => p.editing = false,
      error: () => this.error = 'Errore durante il salvataggio'
    });
  }

  aggiornaStatoPrenotazione(p: Prenotazione): void {
    const corpo = this.preparaPrenotazione(p);
    this.prenotazioniService.salva(corpo).subscribe({
      next: () => console.log(`✅ Stato aggiornato per ID ${p.id}`),
      error: () => this.error = 'Errore durante aggiornamento stato'
    });
  }

  cancellaPrenotazione(id: number): void {
    if (confirm('Vuoi davvero eliminarla?')) {
      this.prenotazioniService.cancella(id).subscribe({
        next: () => this.caricaPrenotazioni(),
        error: () => this.error = 'Errore eliminando la prenotazione'
      });
    }
  }

  apriDettagli(p: Prenotazione): void {
    this.prenotazioneDettaglio = { ...p };
  }

  chiudiDettagli(): void {
    this.prenotazioneDettaglio = null;
  }

  preparaPrenotazione(p: Prenotazione): any {
    return {
      id: p.id,
      dataPrenotazione: p.dataPrenotazione, // ← questa è la novità
      dataOra: p.dataOra,
      stato: p.stato,
      note: p.note ?? '',
      trattamento: {
        id: p.trattamento.id
      },
      cliente: {
        id: p.cliente.id,
        nome: p.cliente.nome,
        cognome: p.cliente.cognome,
        email: p.cliente.email,
        telefono: p.cliente.telefono,
        dataNascita: p.cliente.dataNascita
      }
    };
  }
}
