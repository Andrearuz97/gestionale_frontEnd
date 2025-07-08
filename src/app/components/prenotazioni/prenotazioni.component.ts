import { Component, OnInit } from '@angular/core';
import { PrenotazioniService, Prenotazione, Trattamento } from '../../services/prenotazioni.service';
import { TrattamentiService } from '../../services/trattamenti.service';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.scss']
})
export class PrenotazioniComponent implements OnInit {
  nomiClienti: string[] = [];
  prenotazioni: (Prenotazione & { editing?: boolean })[] = [];
  trattamenti: Trattamento[] = [];
  loading = false;
  error = '';
  filtroNome = '';
  filtroData = '';
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

  caricaPrenotazioni() {
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

        this.nomiClienti = [...new Set(
          this.prenotazioni.map(p => `${p.cliente.nome} ${p.cliente.cognome}`.trim())
        )];

        this.loading = false;
      },
      error: err => {
        this.error = 'Errore nel caricamento delle prenotazioni';
        this.loading = false;
      }
    });
  }

  caricaTrattamenti() {
    this.trattamentiService.getTrattamenti().subscribe({
      next: data => this.trattamenti = data,
      error: err => console.error('Errore caricamento trattamenti', err)
    });
  }

  applicaFiltri() {
  this.loading = true;
  this.error = '';

  const nomeInserito = this.filtroNome.trim();
  const data = this.filtroData;

  let queryParams: any = {};

  if (nomeInserito.includes(' ')) {
    // Mario Rossi → nomeCompleto
    queryParams.nomeCompleto = nomeInserito;
  } else if (nomeInserito) {
    // Una sola parola: proviamo prima come nome
    queryParams.nome = nomeInserito;
  }

  if (data) {
    queryParams.data = data;
  }

  this.prenotazioniService.getPrenotazioni(queryParams).subscribe({
    next: dataRisultati => {
      // Se non ha trovato nulla e c'era solo un nome, proviamo come cognome
      if (dataRisultati.length === 0 && nomeInserito && !nomeInserito.includes(' ')) {
        queryParams = { cognome: nomeInserito };
        if (data) queryParams.data = data;

        this.prenotazioniService.getPrenotazioni(queryParams).subscribe({
          next: fallback => {
            this.aggiornaListaPrenotazioni(fallback);
          },
          error: err => {
            console.error('Errore nel fallback cognome:', err);
            this.error = 'Errore durante il filtro';
            this.loading = false;
          }
        });

        return;
      }

      this.aggiornaListaPrenotazioni(dataRisultati);
    },
    error: err => {
      console.error('Errore durante il filtro:', err);
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




  resetFiltri() {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }

  salvaPrenotazione(p: Prenotazione & { editing?: boolean }) {
    const corpo = this.preparaPrenotazione(p);
    this.prenotazioniService.salva(corpo).subscribe({
      next: () => {
        p.editing = false;
      },
      error: err => {
        console.error('❌ Errore durante salvataggio:', err);
        this.error = 'Errore durante il salvataggio';
      }
    });
  }

  aggiornaStatoPrenotazione(p: Prenotazione) {
    const corpo = this.preparaPrenotazione(p);
    this.prenotazioniService.salva(corpo).subscribe({
      next: () => console.log(`✅ Stato aggiornato per prenotazione ID ${p.id}`),
      error: err => {
        console.error('❌ Errore aggiornamento stato:', err);
        this.error = 'Errore durante l\'aggiornamento dello stato';
      }
    });
  }

  cancellaPrenotazione(id: number) {
    if (confirm('Vuoi davvero eliminarla?')) {
      this.prenotazioniService.cancella(id).subscribe({
        next: () => this.caricaPrenotazioni(),
        error: err => this.error = 'Errore eliminando la prenotazione'
      });
    }
  }

  apriDettagli(p: Prenotazione) {
    this.prenotazioneDettaglio = { ...p };
  }

  chiudiDettagli() {
    this.prenotazioneDettaglio = null;
  }

  preparaPrenotazione(p: Prenotazione): any {
    return {
      id: p.id,
      dataOra: p.dataOra,
      stato: p.stato,
      note: p.note ?? '',
      trattamento: {
        id: p.trattamento.id
      },
      cliente: {
        id: (p.cliente as any).id,
        nome: p.cliente.nome,
        cognome: p.cliente.cognome,
        email: p.cliente.email,
        telefono: p.cliente.telefono,
        dataNascita: p.cliente.dataNascita
      }
    };
  }
}
