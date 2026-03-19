"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ModalConfiguracoes({ onClose, mostrarSalario, focoInicial }: any) {
  const [gastos, setGastos] = useState<any[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [rendaInput, setRendaInput] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const { data: g } = await supabase.from('gastos_fixos').select('*').order('created_at', { ascending: true });
    const { data: s } = await supabase.from('configuracoes').select('salario').eq('id', 1).single();
    if (g) setGastos(g);
    if (s) setRendaInput(s.salario.toString());
  }

  const salvarSalario = async () => {
    if (!mostrarSalario) return alert("Abra o cadeado 🔓 para editar a renda!");
    setSalvando(true);
    await supabase.from('configuracoes').update({ salario: Number(rendaInput) }).eq('id', 1);
    setSalvando(false);
    onClose();
  };

  const adicionarGasto = async () => {
    if (!novoNome || !novoValor) return;
    await supabase.from('gastos_fixos').insert([{ nome: novoNome, valor: Number(novoValor) }]);
    setNovoNome(''); setNovoValor('');
    carregarDados();
  };

  const removerGasto = async (id: any) => {
    await supabase.from('gastos_fixos').delete().eq('id', id);
    carregarDados();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-[3rem] max-w-md w-full shadow-2xl animate-in zoom-in-95">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            {focoInicial === 'salario' ? 'Ajustar Renda' : 'Gastos Fixos Mensais'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
        </div>

        {/* TELA DE EDIÇÃO DE SALÁRIO */}
        {focoInicial === 'salario' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-purple-500/20">
              <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2 block">Renda Mensal Líquida</label>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-purple-600">R$</span>
                <input 
                  type="number" 
                  value={rendaInput} 
                  onChange={e => setRendaInput(e.target.value)}
                  className={`bg-transparent text-3xl font-black text-white outline-none w-full ${!mostrarSalario ? 'blur-md pointer-events-none' : ''}`}
                />
              </div>
            </div>
            <button 
              onClick={salvarSalario}
              className="w-full bg-purple-600 p-5 rounded-2xl font-black text-white uppercase tracking-widest hover:bg-purple-500 transition-all"
            >
              {salvando ? 'Salvando...' : 'Confirmar Nova Renda'}
            </button>
          </div>
        )}

        {/* TELA DE GASTOS FIXOS (VAGA, CARTÃO, ETC) */}
        {focoInicial === 'gastos' && (
          <div className="space-y-6">
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {gastos.map((g) => (
                <div key={g.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">{g.nome}</p>
                    <p className="text-xs text-zinc-500 font-mono">R$ {g.valor.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removerGasto(g.id)} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all">✕</button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <input 
                placeholder="Nome do Gasto (ex: Vaga Prédio)" 
                value={novoNome} onChange={e => setNovoNome(e.target.value)}
                className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-purple-500"
              />
              <div className="flex gap-2">
                <input 
                  type="number" placeholder="Valor R$" 
                  value={novoValor} onChange={e => setNovoValor(e.target.value)}
                  className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-purple-500"
                />
                <button onClick={adicionarGasto} className="bg-white text-black px-6 rounded-xl font-black uppercase text-[10px]">Add</button>
              </div>
            </div>
            <button onClick={onClose} className="w-full bg-zinc-900 p-4 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fechar e Atualizar Dashboard</button>
          </div>
        )}

      </div>
    </div>
  );
}