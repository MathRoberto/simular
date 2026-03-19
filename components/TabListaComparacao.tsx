"use client";
import { useState } from 'react';

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos, onIniciarEdicao }: any) {
  const [detalhe, setDetalhe] = useState<any>(null);
  const [selecionadosParaComparar, setSelecionadosParaComparar] = useState<any[]>([]);

  const toggleComparacao = (e: React.MouseEvent, imovel: any) => {
    e.stopPropagation(); // Impede de abrir o Raio-X
    if (selecionadosParaComparar.find(i => i.id === imovel.id)) {
      setSelecionadosParaComparar(selecionadosParaComparar.filter(i => i.id !== imovel.id));
    } else if (selecionadosParaComparar.length < 2) {
      setSelecionadosParaComparar([...selecionadosParaComparar, imovel]);
    }
  };

  const calcularSobra = (imovel: any) => {
    const custo = Number(imovel.aluguel || 0) + Number(imovel.condominio || 0) + Number(imovel.iptu || 0) + 
                  Number(imovel.luz || 0) + Number(imovel.agua || 0) + Number(imovel.gas || 0);
    const sobra = Number(salario || 0) - Number(totalGastosFixos || 0) - custo;
    return { custo, sobra };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="px-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Meus Favoritos</h2>
        {selecionadosParaComparar.length > 0 && (
          <button onClick={() => setSelecionadosParaComparar([])} className="text-[9px] bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full font-black border border-purple-500/30 uppercase animate-pulse">
            ⚔️ DUELO ({selecionadosParaComparar.length}/2)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {imoveisSalvos.map((imovel: any) => {
          const { custo, sobra } = calcularSobra(imovel);
          const estaSelecionado = selecionadosParaComparar.find(i => i.id === imovel.id);

          return (
            <div 
              key={imovel.id} 
              onClick={() => setDetalhe(imovel)} 
              className={`group bg-white/[0.03] backdrop-blur-md border transition-all duration-300 rounded-[3rem] p-8 cursor-pointer hover:scale-[1.01] ${estaSelecionado ? 'border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.15)]' : 'border-white/5 hover:border-white/20'}`}
            >
              {/* HEADER DO CARD */}
              <div className="flex justify-between items-start mb-6 relative">
                <div className="max-w-[70%]">
                  <h3 className="text-2xl font-black text-white uppercase italic truncate pr-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{imovel.nome}</h3>
                  <p className="text-[9px] text-zinc-500 truncate italic">📍 {imovel.endereco}</p>
                </div>
                
                {/* BOTÕES DE AÇÃO - VOLTARAM E ESTÃO VISÍVEIS! */}
                <div className="flex gap-2 relative z-20" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => toggleComparacao(e, imovel)} title="Comparar" className={`p-3 rounded-2xl transition-all ${estaSelecionado ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-zinc-800/50 text-zinc-400 hover:text-purple-400'}`}>
                    {estaSelecionado ? '✅' : '⚖️'}
                  </button>
                  <button onClick={() => onIniciarEdicao(imovel)} title="Editar" className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs text-zinc-400 hover:text-white">⚙️</button>
                  <button onClick={() => onExcluir(imovel.id)} title="Deletar" className="p-3 bg-rose-950/20 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl text-xs transition-all border border-rose-500/10">✕</button>
                </div>
              </div>

              {/* FINANCEIRO */}
              <div className="bg-black/60 rounded-[1.8rem] p-5 border border-purple-900/20 mb-4 pointer-events-none">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">Custo Total</span>
                  <span className="text-lg font-bold text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.3)]">R$ {custo.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Sobra Final</span>
                  <span className={`text-2xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] ${sobra >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>R$ {sobra.toFixed(2)}</span>
                </div>
              </div>

              {/* LOGÍSTICA JF */}
              <div className="mt-6 flex gap-4 text-[9px] font-black uppercase text-zinc-500 italic border-t border-white/5 pt-4">
                <span>🚗 {imovel.tempo_trabalho_carro || 0}m Trampo</span>
                <span>🏃 {imovel.tempo_trabalho_ape || 0}m Trampo</span>
              </div>
              
              <p className="text-center text-[7px] text-zinc-700 font-black uppercase tracking-widest mt-4 group-hover:text-purple-600 transition-colors">Raio-X 🔍</p>
            </div>
          );
        })}
      </div>

      {/* MODAL RAIO-X (Simplificado para o exemplo) */}
      {detalhe && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setDetalhe(null)}>
          <div className="bg-[#0a0a0c] border border-purple-500/20 p-10 rounded-[4rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-white uppercase italic mb-8 border-b border-white/5 pb-4">{detalhe.nome}</h2>
            <button onClick={() => setDetalhe(null)} className="w-full mt-10 bg-zinc-900 p-5 rounded-3xl font-black text-zinc-500 uppercase tracking-widest">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}