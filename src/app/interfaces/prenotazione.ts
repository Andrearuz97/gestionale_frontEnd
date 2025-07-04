export interface Trattamento {
  id: number;
  nome: string;
}

export interface Prenotazione {
  id: number;
  nome: string;
  dataOra: string;
  trattamento: Trattamento;
  stato: string;
}
