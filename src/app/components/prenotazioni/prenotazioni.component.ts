import { Component, OnInit } from '@angular/core';
import { Prenotazione } from 'src/app/interfaces/prenotazione';
import { PrenotazioniService } from 'src/app/services/prenotazioni.service';

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
  nomiClienti: string[] = [];


  constructor(private prenotazioniService: PrenotazioniService) {}

  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

 caricaPrenotazioni(): void {
  this.loading = true;
  this.error = '';
  this.prenotazioniService.getPrenotazioni().subscribe({
    next: data => {
      this.prenotazioni = data.map(p => ({ ...p, editing: false }));
      this.loading = false;
    },
    error: err => {
      this.error = 'Errore nel caricamento';
      this.loading = false;
    }
  });
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
    // Se c'è testo, usiamo la ricerca generica
    this.prenotazioniService.ricerca(testo).subscribe({
      next: dataRicevuta => {
        // Se c'è anche una data, filtra anche per quella
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
    // Solo data senza testo
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
    // Nessun filtro → carica tutto
    this.caricaPrenotazioni();
  }
}


  resetFiltri(): void {
    this.filtroNome = '';
    this.filtroData = '';
    this.caricaPrenotazioni();
  }

  salvaPrenotazione(p: Prenotazione): void {
    this.prenotazioniService.salva(p).subscribe();
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
