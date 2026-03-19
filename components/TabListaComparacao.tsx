"use client";
import { useState } from 'react';

export default function TabListaComparacao({ imoveisSalvos, onExcluir, salario, totalGastosFixos }: any) {
  const [detalhe, setDetalhe] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {imoveisSalvos.map((imovel: any) => {
        const custo = Number(imovel.aluguel) + Number(imovel.condominio) + Number(imovel.iptu) + Number(imovel.luz) + Number(imovel.agua) + Number(imovel.gas);
        const sobra = salario - totalGastosFixos - custo;

        return (
          <div key={imovel.id} onClick={() => setDetalhe(imovel)} className="group bg-white/[0.03] border border-white/5 p-8 rounded-[3rem] cursor-pointer hover:border-purple-500/40 transition-all relative">
            <button onClick={(e) => { e.stopPropagation(); onExcluir(imovel.id); }} className="absolute top-6 right-6 p-2 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white">✕</button>
            
            <h3 className="text-xl font-black text-white uppercase italic truncate pr-8">{imovel.nome}</h3>
            <p className="text-[9px] text-zinc-500 mb-6 truncate italic">📍 {imovel.endereco}</p>

            <div className="bg-black/40 p-6 rounded-[2rem] border border-purple-900/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-black text-zinc-600 uppercase">Custo</span>
                <span className="text-rose-400 font-bold">R$ {custo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[8px] font-black text-zinc-600 uppercase">Sobra</span>
                <span className="text-2xl font-black text-emerald-400">R$ {sobra.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4 text-[8px] font-black uppercase text-zinc-500 italic">
              <span>🚗 {imovel.tempo_trabalho_carro}m Trampo</span>
              <span>🏃 {imovel.tempo_trabalho_ape}m Trampo</span>
            </div>
            {imovel.link_anuncio && <a href={imovel.link_anuncio} target="_blank" onClick={e => e.stopPropagation()} className="mt-4 block text-[8px] text-purple-400 underline uppercase font-black">🔗 Abrir Anúncio</a>}
          </div>
        );
      })}

      {/* MODAL DETALHES */}
      {detalhe && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setDetalhe(null)}>
          <div className="bg-[#0a0a0c] border border-purple-500/20 p-10 rounded-[4rem] max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-white uppercase italic mb-8 border-b border-white/5 pb-4">{detalhe.nome}</h2>
            <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <div className="flex justify-between"><span>Aluguel</span><span className="text-white">R$ {detalhe.aluguel}</span></div>
              <div className="flex justify-between"><span>Condomínio</span><span className="text-white">R$ {detalhe.condominio}</span></div>
              <div className="flex justify-between border-t border-white/5 pt-4"><span>🚗 Casa do Pai</span><span className="text-purple-400">{detalhe.tempo_casa_carro} min</span></div>
              <div className="flex justify-between"><span>🏃 Casa do Pai</span><span className="text-purple-400">{detalhe.tempo_casa_ape} min</span></div>
            </div>
            <button onClick={() => setDetalhe(null)} className="w-full mt-10 bg-zinc-900 p-5 rounded-3xl font-black text-zinc-500 uppercase tracking-widest">Fechar Raio-X</button>
          </div>
        </div>
      )}
    </div>
  );
}