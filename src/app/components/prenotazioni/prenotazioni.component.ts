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
      this.prenotazioni = data;
      this.nomiClienti = [...new Set(data.map(p => p.nome))]; // nomi unici
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

  salvaPrenotazione(p: Prenotazione & { editing?: boolean }) {
    this.prenotazioniService.salva(p).subscribe({
      next: () => console.log('Prenotazione aggiornata'),
      error: err => console.error('Errore durante salvataggio:', err)
    });
  }

  cancellaPrenotazione(id: number) {
    if (confirm('Vuoi davvero eliminare questa prenotazione?')) {
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
          p.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
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
