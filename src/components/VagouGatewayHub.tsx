import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { OfficialLogoDisplay } from './OfficialLogoDisplay';
import { BeautySalonBackgroundSlider } from './BeautySalonBackgroundSlider';
import { VagouRegisterModal, TriadeFormType } from './VagouRegisterModal';

export const VagouGatewayHub: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerFormType, setRegisterFormType] = useState<TriadeFormType>('estabelecimento');

  const handleOpenAdminForm = (formType: TriadeFormType = 'estabelecimento') => {
    setRegisterFormType(formType);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-['Poppins'] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#20C933] selection:text-white overflow-x-hidden">
      {/* 🎞️ SLIDE DE FUNDO DE SERVIÇOS DE BELEZA E SALÃO COM TRANSIÇÃO SUAVE */}
      <BeautySalonBackgroundSlider />

      {/* 🚀 CONTEÚDO PRINCIPAL CENTRALIZADO COM EFEITO VIDRO JATEADO (FROSTED GLASS) */}
      <main className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-950/30 backdrop-blur-md border border-white/15 shadow-2xl shadow-black/40 transition-all duration-300">
        {/* 🖼️ DIV DO LOGO OFICIAL CONECTADO DIRETAMENTE AO SUPABASE */}
        <div className="mb-5 w-full flex flex-col items-center">
          <div className="group relative flex flex-col items-center">
            <OfficialLogoDisplay frameClassName="bg-transparent border-0 shadow-none" />
          </div>
        </div>

        {/* 💬 CONTEÚDO DIRETO NA TELA */}
        <div className="w-full flex flex-col items-center text-center space-y-6 max-w-sm">
          {/* TÍTULO E PEDIDO DE DESCULPAS */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              Bem vindo!
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Pedimos desculpas por estarmos em construção
            </p>
          </div>

          {/* CHAMADA PARA CRIAÇÃO DO APP */}
          <div className="space-y-4 w-full flex flex-col items-center">
            <p className="text-sm sm:text-base text-emerald-300 font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Mas você pode criar seu app agora mesmo!
            </p>

            {/* 💎 BOTÃO ELEGANTE: "CRIAR MEU APP" (COM REGRA DE CONTRASTE ABSOLUTA TEXTO BRANCO) */}
            <button
              type="button"
              onClick={() => handleOpenAdminForm('estabelecimento')}
              className="w-full max-w-xs py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#087A2A] via-[#20C933] to-[#38E54B] hover:brightness-105 active:scale-[0.99] text-white font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl shadow-black/60 border border-emerald-400/50 group"
            >
              <span className="text-white font-bold drop-shadow">Criar Meu App</span>
              <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 🔀 NAVEGAÇÃO OCULTA / SEM EXIBIÇÃO */}
        <div aria-hidden="true" className="hidden" />

        {/* RODAPÉ DISCRETO */}
        <div className="mt-8 text-center text-xs text-slate-300/80 drop-shadow">
          <span>vagouapp.com</span>
        </div>
      </main>

      {/* 📋 MODAL DO FORMULÁRIO SOBERANO DIRETO DO ADMIN MASTER (admvapp) */}
      <VagouRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        formType={registerFormType}
      />
    </div>
  );
};

export default VagouGatewayHub;
