import { Prenotazione } from './prenotazione';
export interface Cliente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita: string;
  note?: string;
  nomeCompleto?: string;
  editing?: boolean;
  giaUtente?: boolean;
  utente?: any;
  attivo?: boolean;
  storicoPrenotazioni?: Prenotazione[];
}


