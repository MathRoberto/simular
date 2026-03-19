import { ImovelSalvo } from '../types';

export function calcularResumo(
  salario: number,
  gastosPessoaisFixos: number,
  despesasAp: Partial<ImovelSalvo>
) {
  const custoAp = 
    (Number(despesasAp.aluguel) || 0) + 
    (Number(despesasAp.condominio) || 0) + 
    (Number(despesasAp.iptu) || 0) + 
    (Number(despesasAp.luz) || 0) + 
    (Number(despesasAp.agua) || 0) + 
    (Number(despesasAp.gas) || 0) + 
    (Number(despesasAp.internet) || 0);
    
  const custoTotal = gastosPessoaisFixos + custoAp;
  const sobra = (Number(salario) || 0) - custoTotal;
  
  return { custoAp, custoTotal, sobra };
}

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};