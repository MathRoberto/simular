# 🌌 SimuLar: Dashboard Imobiliário Premium

**SimuLar** é uma plataforma de análise financeira e logística pessoal desenvolvida para otimizar a escolha de imóveis em Juiz de Fora - MG. O sistema combina indicadores de custo fixo, projeção de sobra salarial e cálculos de tempo de deslocamento em tempo real.

---

## 🚀 Funcionalidades Chave

* **Análise de Fluxo de Caixa:** Cálculo automático de sobra mensal baseado em Renda Líquida vs. Custos Fixos (Aluguel, Condomínio, IPTU, Utilidades).
* **Logística Inteligente:** Integração com OSRM (Open Source Routing Machine) para cálculo de tempo de deslocamento (Carro/A pé) para pontos estratégicos:
    * Trabalho (Rua Oscar Vidal)
    * Familiar (Casa do Pai)
* **Modo Duelo (X1):** Interface comparativa técnica entre dois imóveis para decisão baseada em dados reais.
* **Privacidade Multinível:** Sistema de "Cadeados" para ocultar dados sensíveis em ambientes públicos e autenticação robusta via Supabase Auth.
* **Interface Custom:** UI inspirada na estética *Gothic/High-Tech*, otimizada para setups de múltiplos monitores e alta performance.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS + Framer Motion (Animações)
* **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
* **Maps/Routing:** OSRM API + Nominatim (Geocoding)
* **Deployment:** Vercel

---

## ⚙️ Configuração do Ambiente

Para rodar o projeto localmente, siga os passos:

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/simular-dashboard.git](https://github.com/seu-usuario/simular-dashboard.git)
    ```

2.  **Instalar dependências:**
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz e adicione suas credenciais:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=seu_link_do_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
    ```

4.  **Rodar em desenvolvimento:**
    ```bash
    npm run dev
    ```

---

## 🛡️ Segurança e Privacidade

O projeto utiliza **RLS (Row Level Security)** no banco de dados, garantindo que cada usuário autenticado tenha acesso exclusivo aos seus próprios registros. As sessões são gerenciadas via `sessionStorage` para garantir que o acesso expire automaticamente ao fechar o navegador, elevando o padrão de segurança pessoal.

---

## 📍 Localidade de Referência

O sistema está configurado por padrão para a malha urbana de **Juiz de Fora, Minas Gerais**, utilizando coordenadas geográficas locais para precisão absoluta nos cálculos de trânsito e rotas.

---

<p align="center">
  Desenvolvido por <strong>Matheus Roberto</strong> • 2026
</p>