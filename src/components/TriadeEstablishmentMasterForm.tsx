import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  UserCheck,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Scissors,
  Phone,
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
  Store,
  HelpCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { VagouOfficialLogo } from './VagouOfficialLogo';

export interface TriadeEstablishmentMasterFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export type FlowStep =
  | 'user_check'
  | 'user_login'
  | 'user_register'
  | 'establishment_details'
  | 'establishment_location'
  | 'establishment_review'
  | 'completed';

export const TriadeEstablishmentMasterForm: React.FC<TriadeEstablishmentMasterFormProps> = ({
  onClose,
  onSuccess,
}) => {
  // FASE 1 MANDATÓRIA: Deve iniciar OBRIGATORIAMENTE em "user_check"
  const [flowStep, setFlowStep] = useState<FlowStep>('user_check');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado de Usuário (Existente ou Novo)
  const [userMode, setUserMode] = useState<'existing' | 'new' | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado do Estabelecimento (Dados Fiscais & Endereço)
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [category, setCategory] = useState('barbearia');
  const [slug, setSlug] = useState('');

  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Auto-gera o slug com base no nome do salão
  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generated);
  };

  const handleUserCheckChoice = (hasUser: boolean) => {
    if (hasUser) {
      setUserMode('existing');
      setFlowStep('user_login');
    } else {
      setUserMode('new');
      setFlowStep('user_register');
    }
  };

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Avança automaticamente para o formulário do Salão após validar o login
    setFlowStep('establishment_details');
  };

  const handleUserRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }
    // Avança automaticamente para o formulário do Salão após cadastrar o proprietário
    setFlowStep('establishment_details');
  };

  const handleEstablishmentDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlowStep('establishment_location');
  };

  const handleEstablishmentLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlowStep('establishment_review');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFlowStep('completed');
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[4px] p-6 sm:p-8 shadow-2xl relative my-auto animate-fadeIn text-slate-100 font-['Poppins']">
      {/* Botão Fechar */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        title="Fechar Formulário"
      >
        <X className="w-5 h-5" />
      </button>

      {/* CABEÇALHO MESTRE */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <VagouOfficialLogo size="md" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-white text-lg tracking-tight">
              Ficha Cadastral do Estabelecimento
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              Tríade Oficial
            </span>
          </div>
          <p className="text-xs text-slate-400">Onboarding unificado de parceiros e salões</p>
        </div>
      </div>

      {/* TELA DE SUCESSO DO ONBOARDING */}
      {flowStep === 'completed' && (
        <div className="text-center space-y-6 py-6">
          <div className="w-20 h-20 rounded-[4px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Estabelecimento Homologado com Sucesso!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              O cadastro do salão <strong className="text-white">"{name}"</strong> foi associado à conta de <strong className="text-white">{ownerEmail}</strong> e submetido para homologação em <span className="text-emerald-400 font-mono">adm.vagouapp.com</span>.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-[4px] text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Identificador Slug:</span>
              <span className="font-mono text-emerald-400">/salons/{slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CNPJ / CPF:</span>
              <span className="font-mono text-white">{cnpjCpf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status Supabase:</span>
              <span className="text-amber-400 font-bold uppercase font-mono">pending</span>
            </div>
          </div>

          <div className="pt-4">
            <a
              href="https://seunegocio.vagouapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Store className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Acessar Meu Negócio (seunegocio.vagouapp.com)</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FASE 1: USER_CHECK — PERGUNTA MANDATÓRIA INICIAL */}
      {/* ========================================================================= */}
      {flowStep === 'user_check' && (
        <div className="space-y-6 py-2">
          <div className="p-4 rounded-[4px] bg-slate-950/80 border border-slate-800 flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">Fase 1: Verificação de Usuário</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Antes de informar os dados fiscais e endereço do salão, precisamos identificar a conta do proprietário/responsável.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-white text-center">
              O estabelecimento a ser criado já possui usuário cadastrado?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* OPÇÃO 1: SIM (JÁ POSSUI CONTA) */}
              <button
                type="button"
                onClick={() => handleUserCheckChoice(true)}
                className="p-5 rounded-[4px] bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between gap-4 group cursor-pointer shadow-lg"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                    <LogIn className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <strong className="text-white text-sm font-bold block">
                      SIM — Já possuo conta
                    </strong>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Selecionar usuário já cadastrado e acessar conta de gestor
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Acessar Conta & Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* OPÇÃO 2: NÃO (CADASTRAR NOVO USUÁRIO) */}
              <button
                type="button"
                onClick={() => handleUserCheckChoice(false)}
                className="p-5 rounded-[4px] bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between gap-4 group cursor-pointer shadow-lg"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                    <UserPlus className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <strong className="text-white text-sm font-bold block">
                      NÃO — Cadastrar novo usuário
                    </strong>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Criar novo usuário proprietário agora para gerenciar o salão
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Cadastrar Usuário & Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FASE 2A: LOGIN DE USUÁRIO EXISTENTE */}
      {/* ========================================================================= */}
      {flowStep === 'user_login' && (
        <form onSubmit={handleUserLoginSubmit} className="space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <LogIn className="w-4 h-4 text-emerald-400" />
              Acessar Conta de Usuário Existente
            </span>
            <button
              type="button"
              onClick={() => setFlowStep('user_check')}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Voltar para Seleção
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">E-mail do Proprietário Cadastrado *</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
              <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
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
            <label className="block text-slate-300 font-medium mb-1">Senha de Acesso *</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
              <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="password"
                required
                placeholder="Informe sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFlowStep('user_check')}
              className="px-4 py-2.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span className="text-white font-bold">Acessar & Continuar para o Salão</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* FASE 2B: CADASTRO DE NOVO PROPRIETÁRIO */}
      {/* ========================================================================= */}
      {flowStep === 'user_register' && (
        <form onSubmit={handleUserRegisterSubmit} className="space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Cadastrar Novo Usuário Proprietário
            </span>
            <button
              type="button"
              onClick={() => setFlowStep('user_check')}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Voltar para Seleção
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nome Completo do Proprietário *</label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo Cavalcanti"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">WhatsApp / Celular do Proprietário *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                <Phone className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">E-mail do Novo Usuário *</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
              <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="email"
                required
                placeholder="gestor@seusalao.com.br"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full bg-transparent outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Senha de Acesso *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Confirmar Senha *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFlowStep('user_check')}
              className="px-4 py-2.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span className="text-white font-bold">Criar Minha Conta & Continuar para o Salão</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* FASE 4: DADOS FISCAIS DO SALÃO (ESTABLISHMENT_DETAILS) */}
      {/* ========================================================================= */}
      {flowStep === 'establishment_details' && (
        <form onSubmit={handleEstablishmentDetailsSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-[4px] bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Proprietário Vinculado:</span>
            <span className="text-emerald-400 font-bold font-mono">{ownerEmail}</span>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Nome Fantasia do Estabelecimento *
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
              <Scissors className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                required
                placeholder="Ex: Barber Shop Imperial"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-transparent outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Razão Social / Nome Fiscal</label>
              <input
                type="text"
                placeholder="Ex: Imperial Serviços de Beleza LTDA"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">CNPJ ou CPF *</label>
              <input
                type="text"
                required
                placeholder="00.000.000/0001-00"
                value={cnpjCpf}
                onChange={(e) => setCnpjCpf(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm font-mono text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Categoria Principal *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="barbearia">Barbearia</option>
                <option value="salao">Salão de Beleza</option>
                <option value="estetica">Clínica Estética</option>
                <option value="esmalteria">Esmalteria</option>
                <option value="spa">Spa & Bem-estar</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Slug Público no Portal</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-xs font-mono text-emerald-400">
                <span className="text-slate-500 select-none">/salons/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent outline-none text-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFlowStep(userMode === 'existing' ? 'user_login' : 'user_register')}
              className="px-4 py-2.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Usuário</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span className="text-white font-bold">Avançar para Localização</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* FASE 5: LOCALIZAÇÃO & CONTATO */}
      {/* ========================================================================= */}
      {flowStep === 'establishment_location' && (
        <form onSubmit={handleEstablishmentLocationSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">CEP *</label>
              <input
                type="text"
                required
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm font-mono text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Telefone / WhatsApp Comercial do Salão *</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white">
                <Phone className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Logradouro, Número e Bairro *</label>
            <input
              type="text"
              required
              placeholder="Ex: Av. Paulista, 1000 - Bela Vista"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Cidade *</label>
              <input
                type="text"
                required
                placeholder="São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Estado (UF) *</label>
              <input
                type="text"
                required
                maxLength={2}
                placeholder="SP"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 uppercase font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFlowStep('establishment_details')}
              className="px-4 py-2.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Dados Fiscais</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span className="text-white font-bold">Avançar para Revisão</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* FASE 6: REVISÃO FINAL & HOMOLOGAÇÃO */}
      {/* ========================================================================= */}
      {flowStep === 'establishment_review' && (
        <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
          <div className="p-4 rounded-[4px] bg-slate-950 border border-slate-800 space-y-3 text-slate-300">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Resumo Final do Estabelecimento:
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block">Estabelecimento:</span>
                <strong className="text-white text-sm">{name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">CNPJ / CPF:</span>
                <strong className="text-white font-mono">{cnpjCpf}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Localização:</span>
                <strong className="text-white">{city} / {state}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">E-mail do Gestor:</span>
                <strong className="text-white font-mono">{ownerEmail}</strong>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-[4px] bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-[4px] bg-slate-900 border-slate-700 text-[#20C933] focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              Declaro que os dados fornecidos são verídicos e concordo com os{' '}
              <strong className="text-white">Termos de Uso do Ecossistema VagouApp</strong> e com a submissão para homologação em <span className="text-emerald-400 font-mono">adm.vagouapp.com</span>.
            </label>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFlowStep('establishment_location')}
              className="px-4 py-2.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Localização</span>
            </button>

            <button
              type="submit"
              disabled={!acceptedTerms || isSubmitting}
              className="px-6 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] disabled:opacity-50 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span className="text-white font-bold">
                {isSubmitting ? 'Homologando...' : 'Finalizar & Enviar Cadastro'}
              </span>
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
