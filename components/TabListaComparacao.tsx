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

  const toggleComparacao = (e: React.MouseEvent, imovel: any) => {
    e.stopPropagation(); // Não abre o Raio-X ao clicar na balança
    if (selecionadosParaComparar.find(i => i.id === imovel.id)) {
      setSelecionadosParaComparar(selecionadosParaComparar.filter(i => i.id !== imovel.id));
    } else if (selecionadosParaComparar.length < 2) {
      setSelecionadosParaComparar([...selecionadosParaComparar, imovel]);
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-700">
      <div className="px-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Meus Favoritos</h2>
        
        {/* BOTÃO DE RESET DO DUELO */}
        {selecionadosParaComparar.length > 0 && (
          <button 
            onClick={() => setSelecionadosParaComparar([])}
            className="text-[9px] bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full font-black border border-purple-500/30 uppercase animate-pulse"
          >
            ⚔️ Duelo ({selecionadosParaComparar.length}/2)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {imoveisSalvos.map((imovel: any) => {
          const { custo, sobra } = calcularSobra(imovel);
          const estaSelecionado = selecionadosParaComparar.find(i => i.id === imovel.id);
          
          return (
            <div 
              key={imovel.id} 
              onClick={() => setDetalhe(imovel)} 
              className={`group bg-[#111114]/80 backdrop-blur-md border transition-all duration-300 rounded-[2.5rem] p-7 cursor-pointer hover:scale-[1.01] ${estaSelecionado ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'border-white/5 hover:border-purple-500/30'} overflow-hidden relative`}
            >
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="max-w-[65%]">
                  <h3 className="text-2xl font-black text-white leading-none tracking-tight group-hover:text-purple-400 truncate pr-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{imovel.nome}</h3>
                  <p className="text-[10px] text-zinc-500 truncate italic">📍 {imovel.endereco}</p>
                </div>
                
                {/* BOTÕES DE AÇÃO COM DUELO REATIVADO */}
                <div className="flex gap-2 relative z-20" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => toggleComparacao(e, imovel)} 
                    title="Comparar"
                    className={`p-3 rounded-2xl transition-all ${estaSelecionado ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-zinc-800/50 text-zinc-400 hover:text-purple-400'}`}
                  >
                    {estaSelecionado ? '✅' : '⚖️'}
                  </button>
                  <button onClick={() => onIniciarEdicao(imovel)} title="Editar" className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs text-zinc-400 hover:text-white transition-all">⚙️</button>
                  <button onClick={() => onExcluir(imovel.id)} title="Deletar" className="p-3 bg-rose-950/20 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl text-xs transition-all border border-rose-500/10 text-center">✕</button>
                </div>
              </div>

              <div className="bg-black/60 rounded-[1.8rem] p-5 border border-purple-900/20 mb-2 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">Custo Total</span>
                  <span className="text-lg font-bold text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.3)]">{formatarMoeda(custo)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Sobra Final</span>
                  <span className={`text-2xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] ${sobra >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatarMoeda(sobra)}</span>
                </div>
              </div>

              <p className="text-center text-[7px] text-zinc-800 font-black uppercase tracking-widest mt-3 group-hover:text-zinc-600 transition-colors relative z-10">Raio-X 🔍</p>
            </div>
          );
        })}
      </div>

      {/* MODAL RAIO-X */}
      {detalhe && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setDetalhe(null)}>
          <div className="bg-[#0a0a0c] border border-purple-500/20 p-8 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black text-white uppercase italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{detalhe.nome}</h2>
              <button onClick={() => setDetalhe(null)} className="text-zinc-500 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <div className="flex justify-between"><span>Aluguel</span><span className="text-white font-mono">{formatarMoeda(detalhe.aluguel)}</span></div>
              <div className="flex justify-between"><span>Condomínio</span><span className="text-white font-mono">{formatarMoeda(detalhe.condominio)}</span></div>
              <div className="flex justify-between"><span>IPTU</span><span className="text-rose-400 font-mono">{formatarMoeda(detalhe.iptu)}</span></div>
              <div className="flex justify-between text-purple-400"><span>⚡ Luz</span><span className="font-mono">{formatarMoeda(detalhe.luz)}</span></div>
              <div className="flex justify-between text-blue-400"><span>💧 Água</span><span className="font-mono">{formatarMoeda(detalhe.agua)}</span></div>
              <div className="flex justify-between text-orange-400"><span>🔥 Gás</span><span className="font-mono">{formatarMoeda(detalhe.gas)}</span></div>
              
              <div className="border-t border-white/5 mt-4 pt-4 space-y-3">
                <div className="flex justify-between items-center text-zinc-600 text-[8px]">
                  <span>Destino</span>
                  <span className="flex items-center gap-1">🚗 Carro</span>
                  <span className="flex items-center gap-1">🏃 A pé</span>
                </div>
                <div className="flex justify-between text-white font-mono bg-white/5 p-2 rounded-xl">
                  <span>Casa do Pai</span>
                  <span>{detalhe.tempo_casa_carro || 0}m</span>
                  <span>{detalhe.tempo_casa_ape || 0}m</span>
                </div>
                <div className="flex justify-between text-white font-mono bg-white/5 p-2 rounded-xl">
                  <span>Oscar Vidal</span>
                  <span>{detalhe.tempo_trabalho_carro || 0}m</span>
                  <span>{detalhe.tempo_trabalho_ape || 0}m</span>
                </div>
              </div>

              {detalhe.link_anuncio && (
                <div className="mt-6">
                  <a href={detalhe.link_anuncio} target="_blank" rel="noopener noreferrer" className="w-full block bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white text-center py-3 rounded-2xl transition-all border border-purple-500/20 font-black italic text-[9px] tracking-widest uppercase">🔗 Abrir Anúncio</a>
                </div>
              )}
            </div>
            
            <button onClick={() => setDetalhe(null)} className="w-full mt-6 bg-zinc-900 p-4 rounded-2xl font-black text-zinc-500 uppercase tracking-widest border border-white/5 hover:bg-zinc-800 transition-colors">Fechar</button>
          </div>
        </div>
      )}

      {/* MODAL DUELO - COMPLETO */}
      {selecionadosParaComparar.length === 2 && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setSelecionadosParaComparar([])}>
          <div className="max-w-4xl w-full bg-[#0a0a0c]/90 border border-purple-900/30 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-purple-900/20 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
              <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Confronto Direto</h2>
              <button onClick={() => setSelecionadosParaComparar([])} className="bg-zinc-900 p-3 rounded-full text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-900/20">
              {selecionadosParaComparar.map((imovel, idx) => {
                const { sobra } = calcularSobra(imovel);
                const outroSobra = calcularSobra(selecionadosParaComparar[idx === 0 ? 1 : 0]).sobra;
                return (
                  <div key={imovel.id} className="p-10 text-center space-y-6">
                    <h3 className={`text-2xl font-black uppercase italic ${idx === 0 ? 'text-purple-400' : 'text-fuchsia-400'}`}>{imovel.nome}</h3>
                    <div className="bg-black/50 p-6 rounded-[2rem] border border-white/5">
                       <span className="text-[8px] font-black text-zinc-500 uppercase block mb-2">Sobra Mensal</span>
                       <span className={`text-3xl font-black ${sobra > outroSobra ? 'text-emerald-400' : 'text-zinc-500'}`}>{formatarMoeda(sobra)}</span>
                    </div>
                    {sobra > outroSobra && <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest block animate-bounce">🏆 Vantagem Financeira</span>}
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