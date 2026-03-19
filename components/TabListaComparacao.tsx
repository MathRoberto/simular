"use client";
import { useState } from 'react';

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos, onIniciarEdicao }: any) {
  const [detalhe, setDetalhe] = useState<any>(null);
  const [selecionadosParaComparar, setSelecionadosParaComparar] = useState<any[]>([]);

  const calcularSobra = (imovel: any) => {
    const custo = Number(imovel.aluguel || 0) + Number(imovel.condominio || 0) + 
                  Number(imovel.iptu || 0) + Number(imovel.luz || 0) + 
                  Number(imovel.agua || 0) + Number(imovel.gas || 0);
    const sobra = Number(salario || 0) - Number(totalGastosFixos || 0) - custo;
    return { custo, sobra };
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="px-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Meus Favoritos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {imoveisSalvos.map((imovel: any) => {
          const { custo, sobra } = calcularSobra(imovel);
          
          return (
            <div key={imovel.id} onClick={() => setDetalhe(imovel)} className="group bg-[#111114]/80 backdrop-blur-md border border-white/5 transition-all duration-300 rounded-[2.5rem] p-7 cursor-pointer hover:scale-[1.01] hover:border-purple-500/30">
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                  <h3 className="text-2xl font-black text-white leading-none tracking-tight group-hover:text-purple-400 truncate pr-8">{imovel.nome}</h3>
                  <p className="text-[10px] text-zinc-500 truncate italic">📍 {imovel.endereco}</p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onIniciarEdicao(imovel)} className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs text-zinc-400 hover:text-white transition-all">⚙️</button>
                  <button onClick={() => onExcluir(imovel.id)} className="p-3 bg-rose-950/20 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl text-xs transition-all border border-rose-500/10 text-center">✕</button>
                </div>
              </div>

              <div className="bg-black/60 rounded-[1.8rem] p-5 border border-purple-900/20 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">Custo Total</span>
                  <span className="text-lg font-bold text-rose-400">{formatarMoeda(custo)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Sobra Final</span>
                  <span className={`text-2xl font-black ${sobra >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatarMoeda(sobra)}</span>
                </div>
              </div>

              {/* LOGÍSTICA JF - NOMES DAS VARIÁVEIS IGUAIS AO SQL ACIMA */}
              <div className="mt-4 flex flex-wrap gap-3 text-[9px] font-black uppercase text-zinc-500 italic border-t border-white/5 pt-4">
                <span>🚗 {imovel.tempo_trabalho_carro || 0}m Trampo</span>
                <span>🏃 {imovel.tempo_trabalho_ape || 0}m Trampo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL RAIO-X (COM TUDO DE VOLTA) */}
      {detalhe && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setDetalhe(null)}>
          <div className="bg-[#0a0a0c] border border-purple-500/20 p-8 rounded-[3rem] max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black text-white uppercase italic mb-6 border-b border-white/5 pb-4">{detalhe.nome}</h2>
            <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex justify-between"><span>Aluguel</span><span className="text-white font-mono">{formatarMoeda(detalhe.aluguel)}</span></div>
              <div className="flex justify-between"><span>Condomínio</span><span className="text-white font-mono">{formatarMoeda(detalhe.condominio)}</span></div>
              <div className="flex justify-between"><span>IPTU</span><span className="text-rose-400 font-mono">{formatarMoeda(detalhe.iptu)}</span></div>
              <div className="flex justify-between text-purple-400"><span>⚡ Luz</span><span className="font-mono">{formatarMoeda(detalhe.luz)}</span></div>
              <div className="flex justify-between text-blue-400"><span>💧 Água</span><span className="font-mono">{formatarMoeda(detalhe.agua)}</span></div>
              <div className="flex justify-between text-orange-400"><span>🔥 Gás</span><span className="font-mono">{formatarMoeda(detalhe.gas)}</span></div>
              
              <div className="border-t border-white/5 mt-4 pt-4 space-y-2">
                <div className="flex justify-between items-center text-zinc-600 text-[8px]"><span>Percurso</span><span>🚗</span><span>🏃</span></div>
                <div className="flex justify-between text-white font-mono"><span>Casa do Pai</span><span>{detalhe.tempo_casa_carro || 0}m</span><span>{detalhe.tempo_casa_ape || 0}m</span></div>
                <div className="flex justify-between text-white font-mono"><span>Oscar Vidal</span><span>{detalhe.tempo_trabalho_carro || 0}m</span><span>{detalhe.tempo_trabalho_ape || 0}m</span></div>
              </div>
            </div>
            <button onClick={() => setDetalhe(null)} className="w-full mt-8 bg-zinc-900 p-4 rounded-2xl font-black text-zinc-500 uppercase tracking-widest hover:bg-zinc-800 transition-colors">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}