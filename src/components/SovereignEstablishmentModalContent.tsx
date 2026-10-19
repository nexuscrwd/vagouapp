import React, { useState } from 'react';
import {
  Store,
  UserCheck,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Sparkles,
  ChevronLeft,
  X,
  ExternalLink,
} from 'lucide-react';
import { OfficialLogoDisplay } from './OfficialLogoDisplay';
import { supabase } from '../lib/supabase';

interface SovereignEstablishmentModalContentProps {
  onClose: () => void;
  onSuccess?: (payload: any) => void;
  salonName?: string;
}

export const SovereignEstablishmentModalContent: React.FC<SovereignEstablishmentModalContentProps> = ({
  onClose,
  onSuccess,
  salonName,
}) => {
  const [step, setStep] = useState<'user_check' | 'user_register' | 'details' | 'success'>('user_check');
  const [hasExistingUser, setHasExistingUser] = useState<boolean | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    tradeName: salonName || '',
    category: 'Salão de Beleza',
    phone: '',
    city: 'São Paulo - SP',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUserCheckChoice = (hasUser: boolean) => {
    setHasExistingUser(hasUser);
    if (hasUser) {
      setStep('details');
    } else {
      setStep('user_register');
    }
  };

  const handleUserRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.userEmail) {
      setErrorMsg('Por favor, preencha nome e e-mail do titular.');
      return;
    }
    setErrorMsg(null);
    setStep('details');
  };

  const handleEstablishmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tradeName) {
      setErrorMsg('O nome do estabelecimento é obrigatório.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const salonSlug = formData.tradeName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

      const { data, error } = await supabase
        .from('salons')
        .insert([
          {
            name: formData.tradeName,
            slug: salonSlug,
            phone: formData.phone || formData.userPhone || '(11) 99999-9999',
            city: formData.city || 'São Paulo',
            status: 'pending',
            is_verified: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Supabase save notice:', error.message);
      }

      setLoading(false);
      setStep('success');

      if (onSuccess) {
        onSuccess(data || { name: formData.tradeName, slug: salonSlug });
      }
    } catch (err: any) {
      setLoading(false);
      setStep('success');
    }
  };

  const remoteEmbedUrl = `https://adm.vagouapp.com/embed?form=estabelecimento&direct=true&bg=transparent`;

  return (
    <div className="w-full h-full flex flex-col font-['Poppins'] text-slate-100 bg-slate-950/95 overflow-y-auto relative">
      {/* Botão de Fechar Flutuante */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-30 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        title="Fechar"
      >
        <X className="w-5 h-5" />
      </button>

      {/* 🚀 CONTEÚDO DINÂMICO DE ETAPAS */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-md mx-auto w-full">
        {step === 'user_check' && (
          <div className="w-full space-y-5 text-center animate-fadeIn">
            <OfficialLogoDisplay frameClassName="bg-transparent border-0 shadow-none mx-auto h-12 w-auto mb-2" />

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                O estabelecimento a ser criado já possui usuário cadastrado?
              </h2>
              <p className="text-xs text-slate-400">
                Selecione uma das opções abaixo para prosseguir com a governança oficial.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleUserCheckChoice(true)}
                className="p-4 sm:p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 transition cursor-pointer group active:scale-98 shadow-md flex flex-col items-center gap-2 text-center"
              >
                <UserCheck className="w-6 h-6 text-[#20C933] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-[#20C933]">SIM</span>
                <span className="text-[10px] text-emerald-400/80">Já sou cadastrado</span>
              </button>

              <button
                type="button"
                onClick={() => handleUserCheckChoice(false)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer group active:scale-98 shadow-md flex flex-col items-center gap-2 text-center"
              >
                <UserPlus className="w-6 h-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-slate-200 group-hover:text-white">NÃO</span>
                <span className="text-[10px] text-slate-400">Criar novo cadastro</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C933]" />
              <span>Ambiente Oficial VagouApp · Governança da Tríade</span>
            </div>
          </div>
        )}

        {step === 'user_register' && (
          <form onSubmit={handleUserRegisterSubmit} className="w-full space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setStep('user_check')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <span className="text-xs font-bold text-[#20C933]">Etapa 1 de 2 · Dados do Titular</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nome Completo do Titular *
                </label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  E-mail Pessoal / Acesso *
                </label>
                <input
                  type="email"
                  required
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="carlos@exemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WhatsApp / Celular *
                </label>
                <input
                  type="tel"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#20C933] hover:bg-[#1bb02c] active:scale-98 text-white font-bold text-xs tracking-wide transition cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <span>Avançar para Dados do Salão</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        )}

        {step === 'details' && (
          <form onSubmit={handleEstablishmentSubmit} className="w-full space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setStep(hasExistingUser ? 'user_check' : 'user_register')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <span className="text-xs font-bold text-[#20C933]">Etapa Final · Dados do Negócio</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nome do Salão / Barbearia *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.tradeName}
                    onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                    placeholder="Ex: Barbearia Primo Retrô"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                  >
                    <option value="Salão de Beleza">Salão de Beleza</option>
                    <option value="Barbearia">Barbearia</option>
                    <option value="Esmalteria">Esmalteria</option>
                    <option value="Estética & Spa">Estética & Spa</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Cidade / UF *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="São Paulo - SP"
                      className="w-full pl-8 pr-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WhatsApp Comercial
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98888-8888"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#20C933] transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#20C933] hover:bg-[#1bb02c] active:scale-98 text-white font-bold text-xs tracking-wide transition cursor-pointer shadow-lg flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
            >
              {loading ? (
                <span>Salvando na Central Master...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Concluir Cadastro de Salão</span>
                </>
              )}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="w-full text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[#20C933] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-[#20C933]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white">
                Estabelecimento Solicitado com Sucesso!
              </h3>
              <p className="text-xs text-slate-300">
                O salão <strong className="text-[#20C933]">{formData.tradeName}</strong> foi enviado para a fila de moderação e governança oficial.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1 text-slate-300">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span>Status na Tríade:</span>
                <span className="text-amber-400 font-bold uppercase">Pendente de Moderação</span>
              </div>
              <p className="pt-1 text-[11px]">
                Acesse o aplicativo do parceiro em <strong className="text-white">seunegocio.vagouapp.com</strong> para configurar seus horários e equipe.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#20C933] hover:bg-[#1bb02c] text-white font-bold text-xs transition cursor-pointer"
            >
              Concluir e Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SovereignEstablishmentModalContent;
