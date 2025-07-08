import { Cliente } from './cliente';
import { Trattamento } from './trattamento';

export interface Prenotazione {
  id: number;
  dataPrenotazione: string;
  dataOra: string;
  stato: string;
  note?: string;
  cliente: Cliente;
  trattamento: Trattamento;
}
