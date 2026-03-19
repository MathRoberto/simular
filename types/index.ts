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
  tempoTrabalhoCarro: number;
  tempoTrabalhoApe: number;  
  tempoCasaCarro: number;    
  tempoCasaApe: number;      
  link_anuncio?: string; 
}