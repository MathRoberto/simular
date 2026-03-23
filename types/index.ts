export type ImovelSalvo = {
  id: string;
  user_id?: string;
  nome: string;
  endereco: string;
  aluguel: number;
  condominio: number;
  iptu: number;
  luz: number;
  agua: number;
  gas: number;
  internet: number;
  tempos_destinos?: TempoDestinoSalvo[];
  link_anuncio?: string;
  // Legado
  tempoTrabalhoCarro?: number;
  tempoTrabalhoApe?: number;
  tempoCasaCarro?: number;
  tempoCasaApe?: number;
};

export type TempoDestinoSalvo = {
  destinoId: string;
  destinoNome: string;
  carro: number;
  ape: number;
};

export type Destino = {
  id: string;
  user_id?: string;
  nome: string;
  endereco: string;
  created_at?: string;
};