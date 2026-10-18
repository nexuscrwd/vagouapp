import React, { useState, useRef } from 'react';
import {
  Building2,
  ArrowRight,
  Store,
  Layers,
  User,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { OfficialLogoDisplay } from './OfficialLogoDisplay';
import { VagouOfficialLogo } from './VagouOfficialLogo';
import { VagouRegisterModal } from './VagouRegisterModal';
import { QuickSalonLauncher } from './QuickSalonLauncher';
import { UserBusinessHubModal } from './UserBusinessHubModal';
import { SupabaseLogoConfigModal } from './SupabaseLogoConfigModal';

export const VagouGatewayHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'business'>('client');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [isLogoConfigOpen, setIsLogoConfigOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('vagou_official_logo_custom', dataUrl);
        window.dispatchEvent(new Event('vagou_logo_updated'));
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4500);

        try {
          await fetch('/api/upload-logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl }),
          });
        } catch (err) {
          console.warn('API de upload local não respondeu, mas localStorage atualizado:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-['Poppins'] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#20C933] selection:text-white">
      {/* 🚀 CONTEÚDO PRINCIPAL (SEM CABEÇALHO, TUDO DIRETO E RESPONSIVO) */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* 🖼️ MOLDURA DEDICADA PARA EXIBIÇÃO DA IMAGEM DO LOGO OFICIAL DO SUPABASE */}
        <div className="mb-6 w-full flex flex-col items-center">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className="group relative flex flex-col items-center"
          >
            <OfficialLogoDisplay
              frameClassName="bg-transparent border-0 shadow-none"
              onOpenConfig={() => setIsLogoConfigOpen(true)}
            >
              {/* Input escondido para drag & drop ou seleção direta */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </OfficialLogoDisplay>
          </div>

          {uploadSuccess && (
            <div className="mt-2 text-[11px] text-[#20C933] font-medium flex items-center gap-1 animate-fadeIn">
              <CheckCircle className="w-3.5 h-3.5 text-[#20C933]" />
              <span>Imagem oficial do logo aplicada com sucesso!</span>
            </div>
          )}
        </div>

        {/* 🔀 DUAS ABAS DIRETAS: "PRA VOCÊ" & "SEU NEGÓCIO" */}
        <div className="w-full grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-[4px] mb-3 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`py-2.5 px-3 rounded-[4px] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'client'
                ? 'bg-[#20C933] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Pra Você</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`py-2.5 px-3 rounded-[4px] text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'business'
                ? 'bg-[#20C933] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Seu Negócio</span>
          </button>
        </div>

        {/* 📦 CONTEÚDO DA ABA (100% DA LARGURA NO MOBILE, RESPONSIVO, SEM POLUIÇÃO) */}
        <div className="w-full">
          {activeTab === 'client' ? (
            /* ABA 1: PRA VOCÊ (CLIENTE) */
            <div className="w-full bg-slate-900 border border-slate-800 rounded-[4px] p-5 sm:p-6 space-y-4 shadow-2xl animate-fadeIn">
              <a
                href="https://portal.vagouapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-98"
              >
                <span className="text-white font-bold">Portal de Vagas</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>

              {/* 🔍 LOCALIZAR DETERMINADO SALÃO ESPECÍFICO */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">
                  Procurando um salão específico? Busque pelo nome:
                </span>
                <QuickSalonLauncher
                  targetApp="portal"
                  placeholder="Digite o nome do salão (ex: dom-cavalcanti)..."
                  actionLabel="Ver vagas"
                />
              </div>
            </div>
          ) : (
            /* ABA 2: SEU NEGÓCIO (DONO DE ESTABELECIMENTO) */
            <div className="w-full bg-slate-900 border border-slate-800 rounded-[4px] p-5 sm:p-6 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Área do Estabelecimento
                  </h2>
                  <p className="text-xs text-slate-400">
                    Cadastre seu salão ou acesse o painel de gestão.
                  </p>
                </div>
              </div>

              {/* BOTÃO PRINCIPAL: CADASTRO DO SALÃO */}
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-3 px-4 rounded-[4px] bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>Criar Meu Negócio</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              {/* ATALHO PARA MEUS NEGÓCIOS */}
              <div className="text-center pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHubModalOpen(true)}
                  className="text-xs text-emerald-400 hover:underline transition inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Acessar conta ou meus estabelecimentos</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ DISCRETO */}
        <div className="mt-8 text-center text-[11px] text-slate-500">
          <span>vagouapp.com · Todos os direitos reservados</span>
        </div>
      </main>

      {/* 🏛️ MODAL DE CADASTRO OFICIAL VIA EMBED DA CENTRAL SOBERANA (adm.vagouapp.com) */}
      <VagouRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={(payload) => {
          console.log('[VagouApp] Estabelecimento cadastrado com sucesso via Central Soberana:', payload);
          setIsRegisterModalOpen(false);
        }}
      />

      {/* 📦 OVERLAY DO HUB DE NEGÓCIOS & ACERVO DO USUÁRIO */}
      {isHubModalOpen && (
        <UserBusinessHubModal
          onClose={() => setIsHubModalOpen(false)}
          onOpenNewSalonRegistration={() => {
            setIsHubModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}

      {/* 🗄️ MODAL DE CONFIGURAÇÃO DIRETA DO LOGO NO SUPABASE STORAGE */}
      <SupabaseLogoConfigModal
        isOpen={isLogoConfigOpen}
        onClose={() => setIsLogoConfigOpen(false)}
        onSaveUrl={(url) => {
          localStorage.setItem('vagou_supabase_logo_url', url);
          window.dispatchEvent(new Event('vagou_logo_updated'));
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 4500);
        }}
        onUploadFile={(file) => {
          handleFileUpload(file);
        }}
      />
    </div>
  );
};

export default VagouGatewayHub;
