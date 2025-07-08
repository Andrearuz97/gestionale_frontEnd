export interface Cliente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  dataNascita: string;
  nomeCompleto?: string;
  editing?: boolean; // ✅ necessario per evitare errori
}
