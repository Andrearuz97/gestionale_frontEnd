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
        console.log('Prenotazioni ricevute:', data);
        this.prenotazioni = data
          .filter(p => p.cliente)
          .map(p => ({
            ...p,
            editing: false,
            cliente: p.cliente ?? { nome: '', cognome: '', telefono: '', email: '', dataNascita: '' }
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

  salvaPrenotazione(p: Prenotazione & { editing?: boolean }) {
    const corpo = this.preparaPrenotazione(p);
    this.prenotazioniService.salva(corpo).subscribe({
      next: () => {
        console.log('✅ Prenotazione aggiornata');
        p.editing = false;
      },
      error: err => {
        console.error('❌ Errore durante salvataggio:', err);
        this.error = 'Errore durante il salvataggio';
      }
    });
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

  cancellaPrenotazione(id: number) {
    if (confirm('Vuoi davvero eliminarla?')) {
      this.prenotazioniService.cancella(id).subscribe({
        next: () => this.prenotazioni = this.prenotazioni.filter(p => p.id !== id),
        error: err => this.error = 'Errore eliminando la prenotazione'
      });
    }
  }

  applicaFiltri() {
    this.caricaPrenotazioni();
    setTimeout(() => {
      if (this.filtroNome) {
        this.prenotazioni = this.prenotazioni.filter(p =>
          (`${p.cliente?.nome ?? ''} ${p.cliente?.cognome ?? ''}`)
            .toLowerCase()
            .includes(this.filtroNome.toLowerCase())
        );
      }
      if (this.filtroData) {
        this.prenotazioni = this.prenotazioni.filter(p =>
          p.dataOra.startsWith(this.filtroData)
        );
      }
    }, 300);
  }

  resetFiltri() {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }
}
