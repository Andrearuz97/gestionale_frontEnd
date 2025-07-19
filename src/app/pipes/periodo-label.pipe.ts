import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodoLabel'
})
export class PeriodoLabelPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'oggi':
        return 'Oggi';
      case '7giorni':
        return 'Ultimi 7 giorni';
      case 'mese':
        return 'Ultimo mese';
      case 'anno':
        return 'Ultimo anno';
      case 'tutto':
        return 'Tutto';
      default:
        return value;
    }
  }
}
