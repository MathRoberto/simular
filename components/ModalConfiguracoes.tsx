"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ModalConfiguracoes({ onClose, mostrarSalario, focoInicial }: {
  onClose: () => void;
  mostrarSalario: boolean;
  focoInicial: 'gastos' | 'salario';
}) {
  const [gastos, setGastos] = useState<any[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [rendaInput, setRendaInput] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("❌ Erro: Usuário não autenticado no Modal");
    return;
  }

  console.log("🔍 Buscando dados para o UID:", user.id);

  // Busca Gastos Fixos
  const { data: g, error: errG } = await supabase
    .from('gastos_fixos')
    .select('*')
    .eq('user_id', user.id);

  // Busca Salário
  const { data: s, error: errS } = await supabase
    .from('configuracoes')
    .select('*') // Vamos puxar TUDO (*) para ver as colunas
    .eq('user_id', user.id);

  // DEBUG NO CONSOLE
  if (errS) console.error("⚠️ Erro na tabela configuracoes:", errS);
  console.log("📊 Retorno da tabela configuracoes:");
  console.table(s); // Cria uma tabelinha linda no seu F12

  if (g) setGastos(g);
  
  if (s && s.length > 0) {
    console.log("✅ Salário encontrado:", s[0].salario);
    setRendaInput(s[0].salario.toString());
  } else {
    console.log("ℹ️ Nenhum registro de salário para este user. Input resetado para 0.");
    setRendaInput('0');
  }
}

const salvarSalario = async () => {
  if (!mostrarSalario) return alert("Abra o cadeado 🔓!");
  setSalvando(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return setSalvando(false);

  const valorFinal = Number(rendaInput) || 0;

  // TENTA O UPDATE PRIMEIRO
  const { data, error: updateError } = await supabase
    .from('configuracoes')
    .update({ salario: valorFinal })
    .eq('user_id', user.id)
    .select();

  // Se o data veio vazio, significa que esse user ainda não tem a linha de salário
  if (!data || data.length === 0) {
    // Tenta o INSERT
    const { error: insertError } = await supabase
      .from('configuracoes')
      .insert([{ user_id: user.id, salario: valorFinal }]);
    
    // Se der conflito (409/23505), ignoramos porque significa que 
    // outro processo acabou de criar a linha, então o dado já está lá.
    if (insertError && insertError.code !== '23505') {
       console.error("Erro real no insert:", insertError);
    }
  }

  setSalvando(false);
  onClose();
};

  const adicionarGasto = async () => {
    if (!novoNome || !novoValor) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('gastos_fixos').insert([{
      nome: novoNome,
      valor: Number(novoValor),
      user_id: user.id,
    }]);

    setNovoNome('');
    setNovoValor('');
    carregarDados();
  };

  const removerGasto = async (id: any) => {
    await supabase.from('gastos_fixos').delete().eq('id', id);
    carregarDados();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 text-white">
      <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-[3rem] max-w-md w-full shadow-2xl animate-in zoom-in-95">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            {focoInicial === 'salario' ? 'Ajustar Renda' : 'Gastos Fixos Mensais'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">✕</button>
        </div>

        {/* EDIÇÃO DE RENDA */}
        {focoInicial === 'salario' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-purple-500/20">
              <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2 block">
                Renda Mensal Líquida
              </label>
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
              disabled={salvando}
              className="w-full bg-purple-600 p-5 rounded-2xl font-black text-white uppercase tracking-widest hover:bg-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
            >
              {salvando ? 'Sincronizando...' : 'Confirmar Nova Renda'}
            </button>
          </div>
        )}

        {/* GASTOS FIXOS */}
        {focoInicial === 'gastos' && (
          <div className="space-y-6">
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {gastos.map((g) => (
                <div key={g.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                  <div>
                    <p className="text-[10px] font-black uppercase text-white">{g.nome}</p>
                    <p className="text-xs text-zinc-500 font-mono italic">R$ {Number(g.valor).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removerGasto(g.id)} 
                    className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {gastos.length === 0 && (
                <p className="text-center text-zinc-700 text-[9px] uppercase font-black italic py-4">Nenhum gasto registrado</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <input
                placeholder="Nome (ex: Internet)"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-all"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Valor R$"
                  value={novoValor}
                  onChange={e => setNovoValor(e.target.value)}
                  className="w-full bg-black/50 p-4 rounded-xl border border-white/10 text-white text-sm outline-none focus:border-purple-500 transition-all"
                />
                <button 
                  onClick={adicionarGasto} 
                  className="bg-white text-black px-6 rounded-xl font-black uppercase text-[10px] hover:bg-purple-400 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <button onClick={onClose} className="w-full bg-zinc-900 p-4 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors border border-white/5">
              Fechar e Atualizar Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}