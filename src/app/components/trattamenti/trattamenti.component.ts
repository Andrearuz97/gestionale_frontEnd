import { Component, OnInit } from '@angular/core';
import { Trattamento } from '../../interfaces/trattamento';
import { TrattamentiService } from '../../services/trattamenti.service';

@Component({
  selector: 'app-trattamenti',
  templateUrl: './trattamenti.component.html',
  styleUrls: ['./trattamenti.component.scss']
})
export class TrattamentiComponent implements OnInit {
  trattamenti: Trattamento[] = [];
  loading = false;
  error = '';
  termineRicerca: string = '';

  nuovoTrattamento: Partial<Trattamento> = {
    nome: '',
    prezzo: undefined,
    durata: undefined
  };

  trattamentoInModifica: Trattamento | null = null;

  constructor(private trattamentiService: TrattamentiService) {}

  ngOnInit(): void {
    this.caricaTrattamenti();
  }

  caricaTrattamenti(): void {
    this.loading = true;
    this.trattamentiService.getTrattamenti().subscribe({
      next: data => {
        this.trattamenti = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento trattamenti';
        this.loading = false;
      }
    });
  }

  creaTrattamento(): void {
    if (!this.nuovoTrattamento.nome || this.nuovoTrattamento.prezzo == null || this.nuovoTrattamento.durata == null) {
      alert('Compila tutti i campi');
      return;
    }

    this.trattamentiService.creaTrattamento(this.nuovoTrattamento).subscribe({
      next: () => {
        this.caricaTrattamenti();
        this.nuovoTrattamento = { nome: '', prezzo: undefined, durata: undefined };
      },
      error: () => {
        alert('Errore durante la creazione del trattamento.');
      }
    });
  }

  preparaModifica(t: Trattamento): void {
    this.trattamentoInModifica = { ...t };
    this.nuovoTrattamento = {
      nome: t.nome,
      prezzo: t.prezzo,
      durata: t.durata
    };
  }

  aggiornaTrattamento(): void {
    if (!this.trattamentoInModifica) return;

    const aggiornato: Trattamento = {
      ...this.trattamentoInModifica,
      nome: this.nuovoTrattamento.nome!,
      prezzo: this.nuovoTrattamento.prezzo!,
      durata: this.nuovoTrattamento.durata!,
      attivo: this.trattamentoInModifica.attivo,
      dataCreazione: this.trattamentoInModifica.dataCreazione
    };

    this.trattamentiService.aggiornaTrattamento(aggiornato.id, aggiornato).subscribe({
      next: () => {
        this.caricaTrattamenti();
        this.trattamentoInModifica = null;
        this.nuovoTrattamento = { nome: '', prezzo: undefined, durata: undefined };
      },
      error: () => alert('Errore durante l\'aggiornamento.')
    });
  }

  disattiva(id: number): void {
    this.trattamentiService.disattivaTrattamento(id).subscribe(() => this.caricaTrattamenti());
  }

  attiva(id: number): void {
    this.trattamentiService.attivaTrattamento(id).subscribe(() => this.caricaTrattamenti());
  }

  cancella(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo trattamento?')) {
      this.trattamentiService.cancellaTrattamento(id).subscribe(() => this.caricaTrattamenti());
    }
  }
  cercaTrattamenti(): void {
  if (!this.termineRicerca.trim()) {
    this.caricaTrattamenti();
    return;
  }

  this.trattamentiService.cercaTrattamenti(this.termineRicerca).subscribe({
    next: data => {
      this.trattamenti = data;
    },
    error: () => {
      alert('Errore nella ricerca trattamenti.');
    }
  });
}

}
