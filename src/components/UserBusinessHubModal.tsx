import React, { useState } from 'react';
import {
  X,
  Store,
  Mail,
  Lock,
  ArrowRight,
  LogOut,
  Plus,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { initialSalons } from '../data/mockDatabase';
import { Salon } from '../types/admin';
import { VagouOfficialLogo } from './VagouOfficialLogo';

interface UserBusinessHubModalProps {
  onClose: () => void;
  onOpenNewSalonRegistration: () => void;
}

export const UserBusinessHubModal: React.FC<UserBusinessHubModalProps> = ({
  onClose,
  onOpenNewSalonRegistration,
}) => {
  // Simulação de sessão de login do gestor
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState('carlos@cavalcanti.com.br');
  const [password, setPassword] = useState('••••••••');
  const [loginLoading, setLoginLoading] = useState(false);

  // Acervo de estabelecimentos associados ao usuário logado
  const [userSalons, setUserSalons] = useState<Salon[]>([
    initialSalons[0], // Barbearia Dom Cavalcanti
    initialSalons[2], // L'Atelier Concept Hair
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setIsLoggedIn(true);
      // Associa os salões mockados
      setUserSalons([initialSalons[0], initialSalons[2]]);
    }, 600);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleEnterSalon = (salon: Salon) => {
    window.location.href = `https://seunegocio.vagouapp.com?salon=${salon.slug}&source=hub`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn text-slate-100 font-['Poppins']">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[4px] p-6 sm:p-8 shadow-2xl relative my-auto">
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABEÇALHO */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <VagouOfficialLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                {isLoggedIn ? 'Acervo de Estabelecimentos' : 'Central de Acesso VagouApp'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                SSO Unificado
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isLoggedIn
                ? 'Gerencie seus negócios ou navegue entre os apps do ecossistema'
                : 'Acesse sua conta para visualizar todos os seus estabelecimentos'}
            </p>
          </div>
        </div>

        {!isLoggedIn ? (
          /* TELA DE LOGIN DO USUÁRIO */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="p-4 rounded-[4px] bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-medium">Conta de Gestor / Proprietário</span>
              <p className="text-slate-300">
                Entre com seu e-mail para carregar seu acervo de estabelecimentos e acessar o app do seu negócio.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">E-mail do Proprietário *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="gestor@seusalao.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Senha de Acesso *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Sua senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewSalonRegistration();
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Ainda não tem cadastro? Criar meu negócio
              </button>

              <button
                type="submit"
                disabled={loginLoading}
                className="px-6 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span className="text-white font-bold">
                  {loginLoading ? 'Carregando...' : 'Entrar na Conta'}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        ) : (
          /* TELA COM ACERVO DE ESTABELECIMENTOS DO USUÁRIO */
          <div className="space-y-6 text-xs">
            {/* BARRA DO USUÁRIO LOGADO */}
            <div className="p-3.5 rounded-[4px] bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-white font-bold block">{email}</span>
                  <span className="text-slate-400 text-[11px]">
                    {userSalons.length} estabelecimento(s) vinculado(s)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer text-xs"
                title="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>

            {/* LISTA DO ACERVO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
                  Seus Estabelecimentos Ativos
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNewSalonRegistration();
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Unidade / Filial</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {userSalons.map((salon) => (
                  <div
                    key={salon.id}
                    className="p-4 rounded-[4px] bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{salon.name}</span>
                        {salon.isVerified && (
                          <span title="Verificado">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                          {salon.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {salon.city} - {salon.state}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-emerald-400">/{salon.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEnterSalon(salon)}
                        className="w-full sm:w-auto px-4 py-2 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        <Store className="w-3.5 h-3.5 text-white" />
                        <span className="text-white font-bold">Entrar no Salão</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO DE APPS DO ECOSSISTEMA */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              <span className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400 block">
                Todos os Apps do Sistema (Tríade VagouApp)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="https://portal.vagouapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-[4px] bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2">
                    <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <strong className="text-white block">Portal de Vagas (pvapp)</strong>
                      <span className="text-[11px] text-slate-400">Marketplace & Radar do Cliente</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </a>

                <a
                  href="https://seunegocio.vagouapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-[4px] bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <div>
                      <strong className="text-white block">Meu Negócio (mnvapp)</strong>
                      <span className="text-[11px] text-slate-400">Gestão diária de agenda e equipe</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
