"use client";

import { useState } from 'react';

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos, onIniciarEdicao }: any) {
  const [selecionadosParaComparar, setSelecionadosParaComparar] = useState<any[]>([]);
  const [imovelDetalhado, setImovelDetalhado] = useState<any>(null);

  const toggleComparacao = (e: React.MouseEvent, imovel: any) => {
    e.stopPropagation(); // Impede de abrir o Raio-X ao clicar na balança
    if (selecionadosParaComparar.find(i => i.id === imovel.id)) {
      setSelecionadosParaComparar(selecionadosParaComparar.filter(i => i.id !== imovel.id));
    } else if (selecionadosParaComparar.length < 2) {
      setSelecionadosParaComparar([...selecionadosParaComparar, imovel]);
    }
  };

  const calcularDados = (imovel: any) => {
    const custo = Number(imovel.aluguel) + Number(imovel.condominio) + Number(imovel.iptu) + 
                  Number(imovel.luz) + Number(imovel.agua) + Number(imovel.gas);
    const sobra = Number(salario) - Number(totalGastosFixos) - custo;
    return { custo, sobra };
  };

  return (
    <div className="space-y-6 pb-28">
      {/* HEADER */}
      <div className="px-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Meus Favoritos</h2>
        {selecionadosParaComparar.length > 0 && (
          <button 
            onClick={() => setSelecionadosParaComparar([])}
            className="text-[9px] bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full font-black border border-purple-500/30 uppercase animate-pulse"
          >
            Modo Duelo ({selecionadosParaComparar.length}/2)
          </button>
        )}
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {imoveisSalvos.map((imovel: any) => {
          const { custo, sobra } = calcularDados(imovel);
          const estaSelecionado = selecionadosParaComparar.find(i => i.id === imovel.id);
          
          return (
            <div 
              key={imovel.id} 
              onClick={() => setImovelDetalhado(imovel)}
              className={`group bg-[#0f0f12] border transition-all duration-300 rounded-[2.5rem] p-7 cursor-pointer hover:scale-[1.01] ${estaSelecionado ? 'border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.15)]' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                  <h3 className="text-2xl font-black text-white leading-none tracking-tight group-hover:text-purple-400">{imovel.nome}</h3>
                  <p className="text-[10px] text-zinc-500 mt-2 font-medium truncate">📍 {imovel.endereco}</p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => toggleComparacao(e, imovel)} className={`p-3 rounded-2xl transition-all ${estaSelecionado ? 'bg-purple-600 text-white' : 'bg-zinc-800/50 text-zinc-400 hover:text-purple-400'}`}>
                    {estaSelecionado ? '✅' : '⚖️'}
                  </button>
                  <button onClick={() => onIniciarEdicao(imovel)} className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs">⚙️</button>
                </div>
              </div>

              <div className="bg-black/40 rounded-[1.8rem] p-5 border border-white/5 mb-4 pointer-events-none">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">Custo Total</span>
                  <span className="text-lg font-bold text-rose-400">{formatarMoeda(custo)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Sobra Final</span>
                  <span className={`text-2xl font-black ${sobra >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatarMoeda(sobra)}</span>
                </div>
              </div>
              <p className="text-center text-[7px] text-zinc-700 font-black uppercase tracking-widest">Clique para ver Raio-X 🔍</p>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: RAIO-X (INFO DO CARD) */}
      {imovelDetalhado && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setImovelDetalhado(null)}>
          <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Raio-X: {imovelDetalhado.nome}</h2>
              <button onClick={() => setImovelDetalhado(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Aluguel', val: imovelDetalhado.aluguel },
                { label: 'Condomínio', val: imovelDetalhado.condominio },
                { label: 'IPTU', val: imovelDetalhado.iptu },
                { label: 'Luz (Cemig)', val: imovelDetalhado.luz, color: 'text-purple-400' },
                { label: 'Água (Cesama)', val: imovelDetalhado.agua, color: 'text-blue-400' },
                { label: 'Gás', val: imovelDetalhado.gas, color: 'text-orange-400' },
              ].map((item: any, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-black text-zinc-600">{item.label}</span>
                  <span className={`font-mono font-bold ${item.color || 'text-white'}`}>{formatarMoeda(item.val)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setImovelDetalhado(null)} className="w-full mt-8 bg-zinc-900 p-4 rounded-2xl text-[10px] font-black uppercase border border-white/5 hover:bg-white/5 transition-all">Voltar</button>
          </div>
        </div>
      )}

      {/* MODAL 2: DUELO (COMPARAÇÃO) */}
      {selecionadosParaComparar.length === 2 && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500">
          <div className="max-w-5xl w-full bg-[#0a0a0c] border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-purple-900/10 to-fuchsia-900/10">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Duelo de Imóveis</h2>
              <button onClick={() => setSelecionadosParaComparar([])} className="bg-zinc-900 p-4 rounded-full text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/5">
              {selecionadosParaComparar.map((imovel, idx) => {
                const { custo, sobra } = calcularDados(imovel);
                const outro = selecionadosParaComparar[idx === 0 ? 1 : 0];
                const { sobra: sobraOutro } = calcularDados(outro);
                return (
                  <div key={imovel.id} className="p-8 md:p-12 space-y-8">
                    <div className="text-center">
                      <h3 className={`text-3xl font-black uppercase italic ${idx === 0 ? 'text-purple-400' : 'text-fuchsia-400'}`}>{imovel.nome}</h3>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-white/5 rounded-[2rem] border border-white/5">
                      <span className="text-[9px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Sobra Mensal</span>
                      <span className={`text-4xl font-black tracking-tighter ${sobra > sobraOutro ? 'text-emerald-400 scale-110' : 'text-zinc-400'} transition-all`}>
                        {formatarMoeda(sobra)}
                      </span>
                      {sobra > sobraOutro && <span className="text-[8px] font-black text-emerald-500 mt-2 animate-bounce">🏆 VENCEDOR FINANCEIRO</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}