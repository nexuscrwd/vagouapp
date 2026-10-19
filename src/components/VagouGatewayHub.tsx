import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { OfficialLogoDisplay } from './OfficialLogoDisplay';
import { BeautySalonBackgroundSlider } from './BeautySalonBackgroundSlider';
import { VagouRegisterModal, TriadeFormType } from './VagouRegisterModal';

export const VagouGatewayHub: React.FC = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerFormType, setRegisterFormType] = useState<TriadeFormType>('estabelecimento');
  const [isMounted, setIsMounted] = useState(false);

  // Efeito suave de esmaecimento (fade-in gradual) na renderização inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdminForm = (formType: TriadeFormType = 'estabelecimento') => {
    setRegisterFormType(formType);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-['Poppins'] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#20C933] selection:text-white overflow-x-hidden">
      {/* 🎞️ SLIDE DE FUNDO DE SERVIÇOS DE BELEZA E SALÃO COM TRANSIÇÃO SUAVE */}
      <BeautySalonBackgroundSlider />

      {/* 🚀 CONTEÚDO PRINCIPAL COM "TCHAM": VIDRO JATEADO PREMIUM, GLOW AMBIENTAL E ESMAECIMENTO SUAVE */}
      <main
        className={`relative z-10 w-full max-w-md mx-auto flex flex-col items-center p-6 sm:p-9 rounded-2xl sm:rounded-3xl bg-slate-950/45 backdrop-blur-xl border border-white/20 shadow-[0_12px_48px_rgba(0,0,0,0.65)] transition-all duration-1000 ease-out transform ${
          isMounted
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.98] translate-y-3'
        }`}
      >
        {/* 🖼️ DIV DO LOGO OFICIAL PURO (SEM EFEITOS DE BLUR OU GLOW) */}
        <div
          className={`mb-6 w-full flex flex-col items-center transition-all duration-700 ease-out transform ${
            isMounted
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <OfficialLogoDisplay frameClassName="bg-transparent border-0 shadow-none relative z-10" />
        </div>

        {/* 💬 CONTEÚDO DIRETO NA TELA */}
        <div className="w-full flex flex-col items-center text-center space-y-4 max-w-sm relative z-10">
          {/* SAUDAÇÃO & STATUS */}
          <div
            className={`space-y-1 transition-all duration-700 delay-200 ease-out transform ${
              isMounted
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <p className="text-sm sm:text-base font-medium text-slate-300 drop-shadow">
              Seja bem vindo!
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Estamos em desenvolvimento
            </h1>
          </div>

          {/* CHAMADA COM 'vc' E 'seu negócio' EM VERDE */}
          <div
            className={`space-y-5 w-full flex flex-col items-center pt-1 transition-all duration-700 delay-400 ease-out transform ${
              isMounted
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow">
              Mas <span className="text-[#20C933] font-semibold">vc</span> já pode criar o app do{' '}
              <span className="text-[#20C933] font-semibold">seu negócio</span>.
            </p>

            {/* 🟢 BOTÃO VERDE SÓLIDO, SIMPLES, SEM EFEITO DE BLUR: "AGORA MESMO!" */}
            <button
              type="button"
              onClick={() => handleOpenAdminForm('estabelecimento')}
              className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-[#20C933] hover:bg-[#1bb02c] active:scale-[0.98] text-white font-bold text-base tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40 border-0"
            >
              <span className="text-white font-bold">Agora mesmo!</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* 🔀 NAVEGAÇÃO OCULTA / SEM EXIBIÇÃO */}
        <div aria-hidden="true" className="hidden" />

        {/* RODAPÉ DISCRETO */}
        <div
          className={`mt-8 text-center text-xs text-slate-300/80 drop-shadow transition-opacity duration-700 delay-700 ease-out ${
            isMounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="tracking-wide">vagouapp.com</span>
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
