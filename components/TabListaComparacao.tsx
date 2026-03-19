"use client";

import { useState } from 'react';

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos, onIniciarEdicao }: any) {
  const [selecionadosParaComparar, setSelecionadosParaComparar] = useState<any[]>([]);
  const [imovelDetalhado, setImovelDetalhado] = useState<any>(null);

  const toggleComparacao = (e: React.MouseEvent, imovel: any) => {
    e.stopPropagation(); // Impede de abrir o Raio-X
    if (selecionadosParaComparar.find(i => i.id === imovel.id)) {
      setSelecionadosParaComparar(selecionadosParaComparar.filter(i => i.id !== imovel.id));
    } else if (selecionadosParaComparar.length < 2) {
      setSelecionadosParaComparar([...selecionadosParaComparar, imovel]);
    }
  };

  const calcularDados = (imovel: any) => {
    const custo = Number(imovel.aluguel || 0) + Number(imovel.condominio || 0) + Number(imovel.iptu || 0) + 
                  Number(imovel.luz || 0) + Number(imovel.agua || 0) + Number(imovel.gas || 0);
    const sobra = Number(salario || 0) - Number(totalGastosFixos || 0) - custo;
    return { custo, sobra };
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="px-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Meus Favoritos</h2>
        {selecionadosParaComparar.length > 0 && (
          <button onClick={() => setSelecionadosParaComparar([])} className="text-[9px] bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full font-black border border-purple-500/30 uppercase animate-pulse">
            Duelo ({selecionadosParaComparar.length}/2)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {imoveisSalvos.map((imovel: any) => {
          const { custo, sobra } = calcularDados(imovel);
          const estaSelecionado = selecionadosParaComparar.find(i => i.id === imovel.id);
          
          return (
            <div 
              key={imovel.id} 
              onClick={() => setImovelDetalhado(imovel)}
              className={`group bg-[#111114]/80 backdrop-blur-md border transition-all duration-300 rounded-[2.5rem] p-7 cursor-pointer hover:scale-[1.01] hover:border-purple-500/30 ${estaSelecionado ? 'border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.3)]' : 'border-white/5'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                  <h3 className="text-2xl font-black text-white leading-none tracking-tight group-hover:text-purple-400 truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{imovel.nome}</h3>
                  <p className="text-[10px] text-zinc-500 mt-2 font-medium truncate italic">📍 {imovel.endereco}</p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => toggleComparacao(e, imovel)} className={`p-3 rounded-2xl transition-all ${estaSelecionado ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-zinc-800/50 text-zinc-400 hover:text-purple-400'}`}>
                    {estaSelecionado ? '✅' : '⚖️'}
                  </button>
                  <button onClick={() => onIniciarEdicao(imovel)} className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs text-zinc-400 hover:text-white">⚙️</button>
                </div>
              </div>

              <div className="bg-black/60 rounded-[1.8rem] p-5 border border-purple-900/20 mb-4 pointer-events-none">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">Custo Total</span>
                  <span className="text-lg font-bold text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.3)]">{formatarMoeda(custo)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Sobra Final</span>
                  <span className={`text-2xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] ${sobra >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatarMoeda(sobra)}</span>
                </div>
              </div>
              <p className="text-center text-[7px] text-zinc-700 font-black uppercase tracking-widest group-hover:text-purple-600 transition-colors">Raio-X 🔍</p>
            </div>
          );
        })}
      </div>

      {/* MODAL RAIO-X (DETALHES) */}
      {imovelDetalhado && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setImovelDetalhado(null)}>
          <div className="bg-[#0a0a0c] border border-purple-900/20 p-8 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Detalhes: {imovelDetalhado.nome}</h2>
              <button onClick={() => setImovelDetalhado(null)} className="text-zinc-500 hover:text-white text-xl">✕</button>
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

            {/* AQUI ESTÁ O LINK CORRIGIDO NO MODAL */}
            {imovelDetalhado.link_anuncio && (
              <a 
                href={imovelDetalhado.link_anuncio} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full mt-8 bg-purple-600/10 border border-purple-500/20 p-4 rounded-2xl text-[10px] font-black text-purple-400 uppercase text-center block tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                🔗 Abrir Anúncio Original
              </a>
            )}

            <button onClick={() => setImovelDetalhado(null)} className="w-full mt-3 bg-zinc-900 p-4 rounded-2xl text-[10px] font-black uppercase text-zinc-500 tracking-widest border border-white/5 hover:bg-zinc-800 transition-colors">Fechar</button>
          </div>
        </div>
      )}

      {/* MODAL DUELO */}
      {selecionadosParaComparar.length === 2 && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10" onClick={() => setSelecionadosParaComparar([])}>
          <div className="max-w-5xl w-full bg-[#0a0a0c]/90 border border-purple-900/30 rounded-[4rem] overflow-hidden shadow-2xl animate-in fade-in-50 duration-500" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-purple-900/20 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Análise Comparativa</h2>
              <button onClick={() => setSelecionadosParaComparar([])} className="bg-zinc-900 p-4 rounded-full text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-900/20">
              {selecionadosParaComparar.map((imovel, idx) => {
                const { sobra } = calcularDados(imovel);
                const outroSobra = calcularDados(selecionadosParaComparar[idx === 0 ? 1 : 0]).sobra;
                return (
                  <div key={imovel.id} className="p-12 text-center space-y-6 bg-[#0a0a0c]">
                    <h3 className={`text-3xl font-black uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${idx === 0 ? 'text-purple-400' : 'text-fuchsia-400'}`}>{imovel.nome}</h3>
                    <div className="p-8 bg-black/50 rounded-[2rem] border border-purple-900/20 shadow-inner">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Sobra Final Estimada</span>
                       <span className={`text-4xl font-black drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] ${sobra > outroSobra ? 'text-emerald-400 scale-110' : 'text-zinc-400'} transition-all inline-block`}>{formatarMoeda(sobra)}</span>
                    </div>
                    {imovel.link_anuncio && <a href={imovel.link_anuncio} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-purple-500 underline uppercase tracking-widest hover:text-white transition-colors">Abrir Site</a>}
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