"use client";
import { useState } from 'react';

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos, onIniciarEdicao }: any) {
  const [detalhe, setDetalhe] = useState<any>(null);
  const [selecionadosParaComparar, setSelecionadosParaComparar] = useState<any[]>([]);

  const toggleComparacao = (e: React.MouseEvent, imovel: any) => {
    e.stopPropagation();
    if (selecionadosParaComparar.find(i => i.id === imovel.id)) {
      setSelecionadosParaComparar(selecionadosParaComparar.filter(i => i.id !== imovel.id));
    } else if (selecionadosParaComparar.length < 2) {
      setSelecionadosParaComparar([...selecionadosParaComparar, imovel]);
    }
  };

  const calcularSobra = (imovel: any) => {
    // Pegando todos os custos que reativamos no banco
    const custo = Number(imovel.aluguel || 0) + Number(imovel.condominio || 0) + 
                  Number(imovel.iptu || 0) + Number(imovel.luz || 0) + 
                  Number(imovel.agua || 0) + Number(imovel.gas || 0);
    const sobra = Number(salario || 0) - Number(totalGastosFixos || 0) - custo;
    return { custo, sobra };
  };

  return (
    <div className="space-y-8">
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
              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[60%]">
                  <h3 className="text-2xl font-black text-white uppercase italic truncate pr-8">{imovel.nome}</h3>
                  <p className="text-[9px] text-zinc-500 mb-6 truncate italic">📍 {imovel.endereco}</p>
                </div>
                
                {/* BOTÕES DE AÇÃO - VOLTARAM E ESTÃO VISÍVEIS! */}
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => toggleComparacao(e, imovel)} className={`p-3 rounded-2xl transition-all ${estaSelecionado ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-zinc-800/50 text-zinc-400 hover:text-purple-400'}`}>
                    {estaSelecionado ? '✅' : '⚖️'}
                  </button>
                  <button onClick={() => onIniciarEdicao(imovel)} className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs text-zinc-400 hover:text-white">⚙️</button>
                  <button onClick={() => onExcluir(imovel.id)} className="p-3 bg-rose-950/20 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl text-xs transition-all border border-rose-500/10">✕</button>
                </div>
              </div>

              {/* FINANCEIRO */}
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

              {/* LOGÍSTICA JF */}
              <div className="mt-6 flex gap-4 text-[9px] font-black uppercase text-zinc-500 italic">
                <span>🚗 {imovel.tempo_trabalho_carro || 0}m Trampo</span>
                <span>🏃 {imovel.tempo_trabalho_ape || 0}m Trampo</span>
              </div>
              
              {imovel.link_anuncio && <a href={imovel.link_anuncio} target="_blank" onClick={e => e.stopPropagation()} className="mt-4 block text-[8px] text-purple-400 underline uppercase font-black">🔗 Abrir Anúncio</a>}
            </div>
          );
        })}
      </div>

      {/* MODAL RAIO-X (DETALHES COMPLETOS) */}
      {detalhe && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setDetalhe(null)}>
          <div className="bg-[#0a0a0c] border border-purple-500/20 p-10 rounded-[4rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-white uppercase italic mb-8 border-b border-white/5 pb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{detalhe.nome}</h2>
            
            <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {/* TODAS AS CONTAS DE VOLTA! */}
              <div className="flex justify-between"><span>Aluguel</span><span className="text-white font-mono">R$ {detalhe.aluguel || 0}</span></div>
              <div className="flex justify-between"><span>Condomínio</span><span className="text-white font-mono">R$ {detalhe.condominio || 0}</span></div>
              <div className="flex justify-between"><span>IPTU</span><span className="text-rose-400 font-mono">R$ {detalhe.iptu || 0}</span></div>
              <div className="flex justify-between"><span>⚡ Luz</span><span className="text-purple-400 font-mono">R$ {detalhe.luz || 0}</span></div>
              <div className="flex justify-between"><span>💧 Água</span><span className="text-blue-400 font-mono">R$ {detalhe.agua || 0}</span></div>
              <div className="flex justify-between"><span>🔥 Gás</span><span className="text-orange-400 font-mono">R$ {detalhe.gas || 0}</span></div>
              
              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between items-center text-zinc-600">
                  <span className="text-[8px]">Percurso</span>
                  <span className="text-[8px]">Carro 🚗</span>
                  <span className="text-[8px]">A pé 🏃</span>
                </div>
                {/* TEMPOS DO PAI DE VOLTA! */}
                <div className="flex justify-between text-white font-mono"><span>Casa do Pai</span><span>{detalhe.tempo_casa_carro || 0}m</span><span>{detalhe.tempo_casa_ape || 0}m</span></div>
                <div className="flex justify-between text-white font-mono"><span>Oscar Vidal</span><span>{detalhe.tempo_trabalho_carro || 0}m</span><span>{detalhe.tempo_trabalho_ape || 0}m</span></div>
              </div>
            </div>

            <button onClick={() => setDetalhe(null)} className="w-full mt-10 bg-zinc-900 p-5 rounded-3xl font-black text-zinc-500 uppercase tracking-widest border border-white/5 hover:bg-zinc-800 transition-colors">Fechar Raio-X</button>
          </div>
        </div>
      )}

      {/* MODAL DUELO - COMPLETO! */}
      {selecionadosParaComparar.length === 2 && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-10" onClick={() => setSelecionadosParaComparar([])}>
          <div className="max-w-5xl w-full bg-[#0a0a0c]/90 border border-purple-900/30 rounded-[4rem] overflow-hidden shadow-2xl animate-in fade-in-50" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-purple-900/20 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Análise Comparativa</h2>
              <button onClick={() => setSelecionadosParaComparar([])} className="bg-zinc-900 p-4 rounded-full text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-900/20">
              {selecionadosParaComparar.map((imovel, idx) => {
                const { sobra } = calcularSobra(imovel);
                const outroSobra = calcularSobra(selecionadosParaComparar[idx === 0 ? 1 : 0]).sobra;
                return (
                  <div key={imovel.id} className="p-12 text-center space-y-6 bg-[#0a0a0c]">
                    <h3 className={`text-3xl font-black uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${idx === 0 ? 'text-purple-400' : 'text-fuchsia-400'}`}>{imovel.nome}</h3>
                    <div className="p-8 bg-black/50 rounded-[2rem] border border-purple-900/20 shadow-inner">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Sobra Final</span>
                       <span className={`text-5xl font-black drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] ${sobra > outroSobra ? 'text-emerald-400 scale-110' : 'text-zinc-400'} transition-all inline-block`}>{formatarMoeda(sobra)}</span>
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