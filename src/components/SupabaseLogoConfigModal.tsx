import React, { useState, useEffect } from 'react';
import { Database, Link, Upload, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';

interface SupabaseLogoConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveUrl: (url: string) => void;
  onUploadFile?: (file: File) => void;
  currentUrl?: string;
}

export const SupabaseLogoConfigModal: React.FC<SupabaseLogoConfigModalProps> = ({
  isOpen,
  onClose,
  onSaveUrl,
  onUploadFile,
  currentUrl = '',
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUrlInput(
      localStorage.getItem('vagou_supabase_logo_url') || currentUrl || ''
    );
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleTestAndSave = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Por favor, informe a URL pública do Supabase Storage.');
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');

    // Valida carregamento da imagem real sem qualquer alteração
    const img = new Image();
    img.onload = () => {
      setTestStatus('success');
      localStorage.setItem('vagou_supabase_logo_url', trimmed);
      window.dispatchEvent(new Event('vagou_logo_updated'));
      onSaveUrl(trimmed);
      setTimeout(() => {
        onClose();
      }, 1200);
    };
    img.onerror = () => {
      setTestStatus('error');
      setErrorMessage(
        'Não foi possível carregar a imagem desta URL. Verifique se o bucket "media" está público e se a URL está correta.'
      );
    };
    img.src = trimmed;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (onUploadFile) {
        onUploadFile(file);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Poppins']">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Logo Oficial no Supabase Storage
              </h3>
              <p className="text-xs text-slate-400">
                Conectar a imagem exata sem qualquer filtro ou alteração
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instrução rápida e URL */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Cole a URL Pública gerada no Supabase Storage (Bucket "media"):
          </label>
          <div className="relative">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setTestStatus('idle');
                setErrorMessage('');
              }}
              placeholder="https://[seu-projeto].supabase.co/storage/v1/object/public/media/vagou_logo.png"
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <Link className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="font-semibold text-emerald-400 block">Como obter a URL no Supabase:</span>
            <span>1. Acesse <strong>Storage &gt; Buckets &gt; media</strong> no Supabase.</span><br />
            <span>2. Clique nos 3 pontinhos do arquivo do logo oficial enviado.</span><br />
            <span>3. Clique em <strong>"Get public URL"</strong> e cole no campo acima.</span>
          </div>

          {testStatus === 'error' && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {testStatus === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Logo oficial carregado e validado com sucesso!</span>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleTestAndSave}
            disabled={testStatus === 'testing'}
            className="w-full py-3 px-4 rounded-xl bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>
              {testStatus === 'testing'
                ? 'Validando conexão com Supabase...'
                : 'Salvar e Exibir Imagem Oficial'}
            </span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500">OU envie o arquivo .png do seu computador</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <label className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer text-center">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Selecionar arquivo original (.png) do seu computador</span>
            <input
              type="file"
              accept="image/png,image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SupabaseLogoConfigModal;
