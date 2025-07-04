import { Component, OnInit } from '@angular/core';
import { Trattamento } from '../../interfaces/trattamento';
import { TrattamentiService } from 'src/app/services/trattamenti.service';
@Component({
  selector: 'app-trattamenti',
  templateUrl: './trattamenti.component.html',
  styleUrls: ['./trattamenti.component.scss']
})
export class TrattamentiComponent implements OnInit {
  trattamenti: Trattamento[] = [];
  loading = false;
  error = '';

  constructor(private trattamentiService: TrattamentiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.trattamentiService.getTrattamenti().subscribe({
      next: data => {
        this.trattamenti = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Errore nel caricamento trattamenti';
        this.loading = false;
      }
    });
  }
}
