import { Component, OnInit } from '@angular/core';
import { PrenotazioniService, Prenotazione } from '../../services/prenotazioni.service';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.scss']
})
export class PrenotazioniComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  loading = false;
  error = '';
  statiPossibili = ['CREATA', 'CONFERMATA', 'ANNULLATA', 'COMPLETATA'];

  constructor(private prenotazioniService: PrenotazioniService) {}

  ngOnInit(): void {
    this.loadPrenotazioni();
  }

  loadPrenotazioni() {
    this.loading = true;
    this.error = '';
    this.prenotazioniService.getPrenotazioni().subscribe({
      next: data => {
        this.prenotazioni = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Errore nel caricamento prenotazioni';
        this.loading = false;
      }
    });
  }

  cambiaStato(id: number, stato: string) {
    this.prenotazioniService.aggiornaStato(id, stato).subscribe({
      next: () => console.log('Stato aggiornato con successo'),
      error: err => console.error('Errore aggiornando stato:', err)
    });
  }
}
