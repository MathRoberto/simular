"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Destino } from '@/types';

export default function TabDestinos({
  destinos,
  onAtualizar,
}: {
  destinos: Destino[];
  onAtualizar: () => void;
}) {
  const [novoNome, setNovoNome] = useState('');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState<string | null>(null);

  const adicionarDestino = async () => {
    if (!novoNome.trim() || !novoEndereco.trim()) return;
    setSalvando(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSalvando(false); return; }

    await supabase.from('destinos').insert([{
      user_id: user.id,
      nome: novoNome.trim(),
      endereco: novoEndereco.trim(),
    }]);

    setNovoNome('');
    setNovoEndereco('');
    setSalvando(false);
    onAtualizar();
  };

  const removerDestino = async (id: string) => {
    setRemovendo(id);
    await supabase.from('destinos').delete().eq('id', id);
    setRemovendo(null);
    onAtualizar();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-28 max-w-2xl mx-auto px-2">

      {/* HEADER */}
      <div className="px-4">
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
          Meus Destinos
        </h2>
        <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 italic tracking-wider">
          Endereços usados no cálculo de rotas
        </p>
      </div>

      {/* LISTA DE DESTINOS */}
      <div className="space-y-3">
        {destinos.length === 0 && (
          <div className="text-center py-12 text-zinc-700 text-[10px] font-black uppercase tracking-widest italic border-2 border-dashed border-white/5 rounded-[2.5rem]">
            Nenhum destino cadastrado ainda
          </div>
        )}
        {destinos.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/20 transition-all group"
          >
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-sm font-black text-white uppercase truncate">{d.nome}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5 truncate italic">📍 {d.endereco}</p>
            </div>
            <button
              onClick={() => removerDestino(d.id)}
              disabled={removendo === d.id}
              className="p-3 bg-rose-950/20 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl text-xs border border-rose-500/10 transition-all disabled:opacity-40 flex-shrink-0"
            >
              {removendo === d.id ? '...' : '✕'}
            </button>
          </div>
        ))}
      </div>

      {/* FORMULÁRIO NOVO DESTINO */}
      <div className="bg-[#0a0a0c] border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-4">
        <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">
          Adicionar Novo Destino
        </p>
        <input
          placeholder="Nome (ex: Trabalho, Academia, Casa da Mãe...)"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 text-white text-sm outline-none focus:border-purple-500 transition-all"
        />
        <input
          placeholder="Endereço completo"
          value={novoEndereco}
          onChange={(e) => setNovoEndereco(e.target.value)}
          className="w-full bg-black/50 p-4 rounded-2xl border border-white/5 text-white text-sm outline-none focus:border-purple-500 transition-all"
        />
        <button
          onClick={adicionarDestino}
          disabled={salvando || !novoNome.trim() || !novoEndereco.trim()}
          className="w-full bg-purple-600/20 text-purple-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all disabled:opacity-40"
        >
          {salvando ? 'Salvando...' : '+ Adicionar Destino'}
        </button>
      </div>

    </div>
  );
}