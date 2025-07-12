import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'itDate'
})
export class ItDatePipe implements PipeTransform {
  private datePipe = new DatePipe('it-IT');

  transform(value: any, formato: string = 'dd/MM/yyyy'): string {
    if (!value) return '—';
    return this.datePipe.transform(value, formato) || '';
  }
}
