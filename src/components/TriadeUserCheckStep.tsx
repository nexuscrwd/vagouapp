import React from 'react';
import { UserCheck, Check, UserPlus, ShieldCheck } from 'lucide-react';

interface UserCheckStepProps {
  onSelectYes: () => void;
  onSelectNo: () => void;
}

export const TriadeUserCheckStep: React.FC<UserCheckStepProps> = ({
  onSelectYes,
  onSelectNo,
}) => {
  return (
    <div className="p-6 sm:p-10 space-y-6 text-center animate-fadeIn font-['Poppins']">
      {/* Ícone Central de Usuário */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
        <UserCheck className="w-8 h-8 text-emerald-400" />
      </div>

      {/* Pergunta Principal */}
      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          O estabelecimento a ser criado já possui usuário cadastrado?
        </h2>
      </div>

      {/* Grid com os 2 Cards Oficiais: SIM e NÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
        {/* Opção SIM */}
        <button
          type="button"
          onClick={onSelectYes}
          className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-left transition cursor-pointer group active:scale-98 shadow-md"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-base font-black text-emerald-400 group-hover:text-emerald-300">SIM</span>
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-300 font-medium leading-snug block">
            Selecionar usuário já cadastrado / Acessar conta
          </span>
        </button>

        {/* Opção NÃO */}
        <button
          type="button"
          onClick={onSelectNo}
          className="p-5 rounded-2xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-left transition cursor-pointer group active:scale-98 shadow-md"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-base font-black text-slate-200 group-hover:text-white">NÃO</span>
            <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium leading-snug block">
            Cadastrar novo usuário como proprietário / gestor
          </span>
        </button>
      </div>

      {/* Rodapé institucional de governança */}
      <div className="pt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Ambiente Oficial VagouApp · Governança da Tríade</span>
      </div>
    </div>
  );
};
