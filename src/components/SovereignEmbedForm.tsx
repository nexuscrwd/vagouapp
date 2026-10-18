import React, { useState } from 'react';
import {
  Building2,
  MapPin,
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
  LogIn,
  UserPlus,
} from 'lucide-react';
import { VagouOfficialLogo } from './VagouOfficialLogo';
import { TriadeUserCheckStep } from './TriadeUserCheckStep';

export const SovereignEmbedForm: React.FC = () => {
  const [step, setStep] = useState<'user_check' | 'user_auth' | 'salon_details' | 'success'>('user_check');
  const [userMode, setUserMode] = useState<'existing' | 'new'>('new');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [password, setPassword] = useState('');

  const [salonName, setSalonName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('barbearia');
  const [cnpj, setCnpj] = useState('');
  const [salonPhone, setSalonPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (window.parent) {
      window.parent.postMessage({ source: 'VAGOUAPP_EMBED', event: 'CLOSE', action: 'CLOSE' }, '*');
    }
  };

  const handleNameChange = (val: string) => {
    setSalonName(val);
    const generated = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generated);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      id: `sln-${Date.now()}`,
      name: salonName,
      slug: slug || salonName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category,
      cnpj,
      phone: salonPhone || ownerPhone,
      address,
      city,
      state,
      ownerEmail,
      ownerName,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isVerified: false,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');

      // Emite o evento oficial da Central Soberana via postMessage
      if (window.parent) {
        window.parent.postMessage(
          {
            source: 'VAGOUAPP_EMBED',
            event: 'SALON_MASTER_SUCCESS',
            payload,
          },
          '*'
        );
      }
    }, 800);
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between p-4 sm:p-8">
      {/* Topo do Embed Oficial */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <VagouOfficialLogo variant="icon" size="sm" />
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              Central Soberana de Cadastros
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
              Credenciamento de Estabelecimento
            </h1>
          </div>
        </div>

        <button
          onClick={handleClose}
          type="button"
          aria-label="Fechar formulário"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Conteúdo do Formulário */}
      <div className="my-auto max-w-xl mx-auto w-full py-6">
        {step === 'user_check' && (
          <TriadeUserCheckStep
            onSelectYes={() => {
              setUserMode('existing');
              setStep('user_auth');
            }}
            onSelectNo={() => {
              setUserMode('new');
              setStep('user_auth');
            }}
          />
        )}

        {step === 'user_auth' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('salon_details');
            }}
            className="space-y-4 animate-fadeIn"
          >
            <div className="text-center space-y-1 mb-4">
              <h2 className="text-lg font-bold text-white">
                {userMode === 'existing' ? 'Acesse sua Conta de Gestor' : 'Dados do Gestor Titular'}
              </h2>
              <p className="text-xs text-slate-400">
                {userMode === 'existing'
                  ? 'Informe seu e-mail e senha para prosseguir com o credenciamento.'
                  : 'Seus dados de acesso como gestor da equipe e agenda.'}
              </p>
            </div>

            {userMode === 'new' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Profissional</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="contato@seusalao.com.br"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {userMode === 'new' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep('user_check')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#20C933] hover:bg-[#1db82e] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                Prosseguir para Dados do Estabelecimento <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {step === 'salon_details' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1 mb-4">
              <h2 className="text-lg font-bold text-white">Dados do Estabelecimento</h2>
              <p className="text-xs text-slate-400">
                Informações para indexação no marketplace e homologação pelo Admin Master.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Fantasia do Estabelecimento</label>
                <input
                  type="text"
                  required
                  value={salonName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Dom Cavalcanti Barbearia"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Slug / Identificador Único</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="dom-cavalcanti"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Categoria Principal</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                >
                  <option value="barbearia">Barbearia Clássica & Moderna</option>
                  <option value="salao">Salão de Beleza / Cabeleireiro</option>
                  <option value="estetica">Clínica de Estética & SPA</option>
                  <option value="esmalteria">Esmalteria & Nail Bar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CNPJ / CPF do Estabelecimento</label>
                <input
                  type="text"
                  required
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">Endereço Comercial</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua Oscar Freire, 1420 - Jardins"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cidade / UF</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo, SP"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setStep('user_auth')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#20C933] hover:bg-[#1db82e] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitindo para Central...</span>
                ) : (
                  <>
                    <span>Concluir Cadastro & Homologar</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Credenciamento Registrado!</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Os dados de <strong className="text-white">{salonName}</strong> foram transmitidos e integrados à Central Soberana do VagouApp.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleClose}
                type="button"
                className="px-6 py-2.5 rounded-xl bg-[#20C933] hover:bg-[#1db82e] text-white text-xs font-semibold transition cursor-pointer"
              >
                Concluir e Retornar ao App
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé de Governança */}
      <div className="text-center pt-3 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Central Oficial Soberana · adm.vagouapp.com</span>
      </div>
    </div>
  );
};

export default SovereignEmbedForm;
