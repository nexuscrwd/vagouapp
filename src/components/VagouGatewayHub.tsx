import React, { useState } from 'react';
import {
  Building2,
  CalendarCheck2,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Store,
  Phone,
  Sparkles,
  X,
  User,
  Mail,
  Lock,
  Scissors,
} from 'lucide-react';
import { VagouOfficialLogo } from './VagouOfficialLogo';

export interface VagouGatewayHubProps {
  onOpenAdmin?: () => void;
}

export const VagouGatewayHub: React.FC<VagouGatewayHubProps> = ({ onOpenAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dados do Cadastro Direto
  const [ownerName, setOwnerName] = useState('');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salonName, setSalonName] = useState('');
  const [category, setCategory] = useState('Barbearia');
  const [cityState, setCityState] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simula e valida o registro diretamente no ecossistema
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setOwnerName('');
    setOwnerWhatsapp('');
    setOwnerEmail('');
    setPassword('');
    setSalonName('');
    setCityState('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-['Poppins'] flex flex-col justify-between selection:bg-[#20C933] selection:text-white">
      {/* 🧭 BARRA SUPERIOR */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VagouOfficialLogo size="lg" />
            <span className="font-extrabold text-white text-lg tracking-tight">VagouApp</span>
          </div>

          <a
            href="https://seunegocio.vagouapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-[4px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Já é parceiro?</span>
            <span>Entrar no Salão</span>
          </a>
        </div>
      </header>

      {/* 🚀 CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        <div className="text-center space-y-3 mb-10 sm:mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bem-vindo ao VagouApp</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Para onde você deseja ir hoje?
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Escolha seu objetivo abaixo para ser direcionado ao ambiente ideal.
          </p>
        </div>

        {/* OS 2 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* CARD 1: CLIENTES (PORTAL) */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-[4px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition">
                  <CalendarCheck2 className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-[4px] text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Consumidor / Cliente
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Quero Agendar um Horário
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Encontre salões, barbearias e clínicas perto de você com vagas imediatas ou agende para os próximos dias.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Radar de vagas imediatas para hoje</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Busca inteligente por proximidade no mapa</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="https://portal.vagouapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98"
              >
                <span className="text-white font-bold">Portal de Vagas</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* CARD 2: ESTABELECIMENTOS (ABRE CADASTRO DIRETO NA TELA) */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-[4px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition">
                  <Building2 className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-[4px] text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Salão / Profissional
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Cadastrar Meu Estabelecimento
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Preencha horários ociosos, receba novos clientes pelo Radar e modernize a gestão do seu salão ou barbearia.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Publique vagas ociosas e aumente seu faturamento</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ficha cadastral 100% digital com suporte oficial</span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-2">
              {/* BOTAO QUE ABRE O MODAL DIRETO NA TELA */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-5 rounded-[4px] bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                <span>Criar Meu Negócio</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="text-center">
                <a
                  href="https://seunegocio.vagouapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-emerald-400 transition inline-flex items-center gap-1"
                >
                  <span>Já possui cadastro? Entrar no Meu Negócio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🏢 MODAL DE CADASTRO DIRETO (SEM ABRIR OUTRA ABA) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[4px] p-6 sm:p-8 shadow-2xl relative my-auto animate-fadeIn">
            {/* Fechar */}
            <button
              type="button"
              onClick={resetForm}
              className="absolute top-4 right-4 p-2 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              /* TELA DE SUCESSO */
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-[4px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Estabelecimento Cadastrado!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    O salão <strong>"{salonName}"</strong> foi registrado com sucesso.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://seunegocio.vagouapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <span className="text-white font-bold">Ir para o Meu Negócio</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            ) : (
              /* FORMULÁRIO COMPLETO */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <VagouOfficialLogo size="md" />
                  <div>
                    <h3 className="font-bold text-white text-base">Cadastro de Estabelecimento</h3>
                    <p className="text-xs text-slate-400">Preencha os dados do seu salão ou barbearia</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome do Estabelecimento *
                  </label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                    <Scissors className="w-4 h-4 text-slate-500 mr-2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Barber Shop Imperial"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="Barbearia">Barbearia</option>
                      <option value="Salão de Beleza">Salão de Beleza</option>
                      <option value="Esmalteria">Esmalteria</option>
                      <option value="Estética / Spa">Estética / Spa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade / UF *</label>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                      <MapPin className="w-4 h-4 text-slate-500 mr-2" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: São Paulo / SP"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome *</label>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                      <User className="w-4 h-4 text-slate-500 mr-2" />
                      <input
                        type="text"
                        required
                        placeholder="Nome do responsável"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Celular *</label>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                      <Phone className="w-4 h-4 text-slate-500 mr-2" />
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={ownerWhatsapp}
                        onChange={(e) => setOwnerWhatsapp(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail *</label>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                      <Mail className="w-4 h-4 text-slate-500 mr-2" />
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Senha *</label>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                      <Lock className="w-4 h-4 text-slate-500 mr-2" />
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 6 dígitos"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent outline-none placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98"
                  >
                    <span className="text-white font-bold">{loading ? 'Cadastrando...' : 'Finalizar Cadastro Grátis'}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 🛡️ RODAPÉ */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} VagouApp Tecnologia.</span>
            <span className="hidden sm:inline">Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>Suporte WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VagouGatewayHub;
