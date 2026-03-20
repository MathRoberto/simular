"use client";
import { useState } from 'react';

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos, onIniciarEdicao }: any) {
  const [abertos, setAbertos] = useState<string[]>([]);
  const [selecionadosParaComparar, setSelecionadosParaComparar] = useState<any[]>([]);

  const toggleRaioX = (id: string) => {
    setAbertos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const calcularSobra = (imovel: any) => {
    const custo = Number(imovel.aluguel || 0) + Number(imovel.condominio || 0) + 
                  Number(imovel.iptu || 0) + Number(imovel.luz || 0) + 
                  Number(imovel.agua || 0) + Number(imovel.gas || 0);
    const sobra = Number(salario || 0) - Number(totalGastosFixos || 0) - custo;
    return { custo, sobra };
  };

  const toggleComparacao = (e: React.MouseEvent, imovel: any) => {
    e.stopPropagation();
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
        {selecionadosParaComparar.length > 0 && (
          <button onClick={() => setSelecionadosParaComparar([])} className="text-[9px] bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full font-black border border-purple-500/30 uppercase animate-pulse">⚔️ Duelo ({selecionadosParaComparar.length}/2)</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 items-start">
        {imoveisSalvos.map((imovel: any) => {
          const { custo, sobra } = calcularSobra(imovel);
          const estaSelecionado = selecionadosParaComparar.find(i => i.id === imovel.id);
          const estaAberto = abertos.includes(imovel.id);
          
          return (
            <div key={imovel.id} onClick={() => toggleRaioX(imovel.id)} className={`group bg-[#111114]/80 backdrop-blur-md border transition-all duration-500 rounded-[2.5rem] p-7 cursor-pointer hover:scale-[1.01] ${estaSelecionado ? 'border-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.2)]' : 'border-white/5 hover:border-purple-500/30'} overflow-hidden relative`}>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="max-w-[65%]">
                  <h3 className="text-2xl font-black text-white leading-none tracking-tight group-hover:text-purple-400 truncate pr-8">{imovel.nome}</h3>
                  <p className="text-[10px] text-zinc-500 truncate italic">📍 {imovel.endereco}</p>
                </div>
                <div className="flex gap-2 relative z-20" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => toggleComparacao(e, imovel)} className={`p-3 rounded-2xl transition-all ${estaSelecionado ? 'bg-purple-600 text-white' : 'bg-zinc-800/50 text-zinc-400 hover:text-purple-400'}`}>{estaSelecionado ? '✅' : '⚖️'}</button>
                  <button onClick={() => onIniciarEdicao(imovel)} className="p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-2xl text-xs text-zinc-400">⚙️</button>
                  <button onClick={() => onExcluir(imovel.id)} className="p-3 bg-rose-950/20 hover:bg-rose-600 text-rose-500 rounded-2xl text-xs transition-all border border-rose-500/10">✕</button>
                </div>
              </div>

              <div className="bg-black/60 rounded-[1.8rem] p-5 border border-purple-900/20 relative z-10 shadow-inner">
                <div className="flex justify-between items-center mb-4"><span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">Custo Total</span><span className="text-lg font-bold text-rose-400">{formatarMoeda(custo)}</span></div>
                <div className="flex flex-col items-end"><span className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Sobra Final</span><span className={`text-2xl font-black tracking-tighter ${sobra >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatarMoeda(sobra)}</span></div>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${estaAberto ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                    {/* Lista de custos resumida no card... */}
                    {['aluguel', 'condominio', 'iptu', 'luz', 'agua', 'gas'].map(key => (
                        <div key={key} className="flex justify-between"><span>{key}</span><span className="text-white">{formatarMoeda(imovel[key])}</span></div>
                    ))}
                </div>
              </div>
              <p className="text-center text-[7px] font-black uppercase text-zinc-800 mt-4 tracking-widest">{estaAberto ? 'Recolher 🔼' : 'Raio-X 🔍'}</p>
            </div>
          );
        })}
      </div>

      {/* SUPER MODAL DUELO (DETALHADO) */}
      {selecionadosParaComparar.length === 2 && (() => {
        const item1 = selecionadosParaComparar[0];
        const item2 = selecionadosParaComparar[1];
        const res1 = calcularSobra(item1);
        const res2 = calcularSobra(item2);
        
        const categorias = [
            { label: 'Aluguel', key: 'aluguel' },
            { label: 'Condomínio', key: 'condominio' },
            { label: 'IPTU', key: 'iptu' },
            { label: 'Luz (Cemig)', key: 'luz' },
            { label: 'Água (Cesama)', key: 'agua' },
            { label: 'Gás', key: 'gas' }
        ];

        let vitorias1 = 0;
        let vitorias2 = 0;

        return (
          <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10" onClick={() => setSelecionadosParaComparar([])}>
            <div className="max-w-5xl w-full bg-[#0a0a0c] border border-purple-900/30 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-purple-900/20 flex justify-between items-center bg-gradient-to-r from-purple-900/10 to-fuchsia-900/10">
                <h2 className="text-xl font-black text-white italic uppercase tracking-[0.2em]">Raio-X Comparativo</h2>
                <button onClick={() => setSelecionadosParaComparar([])} className="bg-zinc-900 p-3 rounded-full text-zinc-500 hover:text-white">✕</button>
              </div>

              <div className="overflow-y-auto max-h-[70vh] p-8">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">
                      <th className="pb-4">Categoria</th>
                      <th className="pb-4 text-purple-400 text-center">{item1.nome}</th>
                      <th className="pb-4 text-fuchsia-400 text-center">{item2.nome}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-bold uppercase tracking-widest">
                    {categorias.map(cat => {
                        const val1 = Number(item1[cat.key] || 0);
                        const val2 = Number(item2[cat.key] || 0);
                        const win1 = val1 < val2;
                        const win2 = val2 < val1;
                        if(win1) vitorias1++; if(win2) vitorias2++;

                        return (
                            <tr key={cat.key} className="bg-white/5">
                                <td className="p-5 rounded-l-[1.5rem] text-zinc-400">{cat.label}</td>
                                <td className={`p-5 text-center ${win1 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                    {formatarMoeda(val1)} {win1 && '🏆'}
                                </td>
                                <td className={`p-5 text-center rounded-r-[1.5rem] ${win2 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                    {formatarMoeda(val2)} {win2 && '🏆'}
                                </td>
                            </tr>
                        );
                    })}
                    
                    {/* LINHA DE TOTAIS */}
                    <tr className="text-sm">
                        <td className="p-5 text-white font-black italic">CUSTO TOTAL</td>
                        <td className={`p-5 text-center font-black ${res1.custo < res2.custo ? 'text-emerald-400' : 'text-zinc-400'}`}>
                            {formatarMoeda(res1.custo)} {res1.custo < res2.custo && '⭐'}
                        </td>
                        <td className={`p-5 text-center font-black ${res2.custo < res1.custo ? 'text-emerald-400' : 'text-zinc-400'}`}>
                            {formatarMoeda(res2.custo)} {res2.custo < res1.custo && '⭐'}
                        </td>
                    </tr>
                  </tbody>
                </table>

                {/* VEREDITO FINAL */}
                <div className="mt-10 p-8 bg-purple-900/10 border border-purple-500/20 rounded-[2.5rem] text-center">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 italic">Análise do Cockpit</p>
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">
                        {res1.custo < res2.custo ? item1.nome : item2.nome} É MAIS BARATO NO TOTAL, 
                        <br/>
                        <span className="text-zinc-500 text-sm">
                            MAS {vitorias1 > vitorias2 ? item1.nome : item2.nome} VENCE EM MAIS CATEGORIAS ({vitorias1 > vitorias2 ? vitorias1 : vitorias2} de 6).
                        </span>
                    </h4>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}