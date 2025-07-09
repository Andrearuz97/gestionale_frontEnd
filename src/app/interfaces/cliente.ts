export interface Cliente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita: string;
  nomeCompleto?: string;
  editing?: boolean;
  giaUtente?: boolean;
  utente?: any; // se backend lo include
  attivo?: boolean;
}

