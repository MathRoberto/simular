export type ImovelSalvo = {
  id: string;
  nome: string;
  endereco: string;
  aluguel: number;
  condominio: number;
  iptu: number;
  luz: number;
  agua: number;
  gas: number;
  internet: number;
  tempoTrabalhoCarro: number; // Novo: Carro pro trabalho
  tempoTrabalhoApe: number;   // Novo: A pé pro trabalho
  tempoCasaCarro: number;     // Novo: Carro pra casa
  tempoCasaApe: number;       // Novo: A pé pra casa
};