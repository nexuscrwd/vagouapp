import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  CalendarCheck2,
  Zap,
  Globe,
  FileCode2,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  Edit3,
  Ban,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Phone,
  MapPin,
  FileSpreadsheet,
  Server,
  Activity,
  ArrowUpRight,
  BadgeAlert,
  SlidersHorizontal,
  Home,
  Code,
} from 'lucide-react';
import { VagouOfficialLogo } from './VagouOfficialLogo';
import {
  Salon,
  SalonStatus,
  LightningSlot,
  AppointmentAudit,
  InfraCheck,
  TechnicalCommunique,
} from '../types/admin';
import {
  initialSalons,
  initialLightningSlots,
  initialAppointments,
  initialInfraChecks,
  initialCommuniques,
} from '../data/mockDatabase';

interface AdminMasterSuiteProps {
  onBackToGateway?: () => void;
}

type TabType = 'dashboard' | 'tenants' | 'radar' | 'appointments' | 'infra' | 'communiques';

export const AdminMasterSuite: React.FC<AdminMasterSuiteProps> = ({ onBackToGateway }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Supabase Database State
  const [salons, setSalons] = useState<Salon[]>(initialSalons);
  const [slots, setSlots] = useState<LightningSlot[]>(initialLightningSlots);
  const [appointments, setAppointments] = useState<AppointmentAudit[]>(initialAppointments);
  const [infraChecks, setInfraChecks] = useState<InfraCheck[]>(initialInfraChecks);
  const [communiques, setCommuniques] = useState<TechnicalCommunique[]>(initialCommuniques);

  // Tenant Filters & Search
  const [tenantSearch, setTenantSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SalonStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Edit Tenant Modal
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Salon>>({});

  // Suspend Dialog
  const [suspendingSalon, setSuspendingSalon] = useState<Salon | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  // New Technical Communique Modal
  const [isNewCommuniqueOpen, setIsNewCommuniqueOpen] = useState(false);
  const [newCommunique, setNewCommunique] = useState({
    title: '',
    scope: 'schema' as TechnicalCommunique['scope'],
    impactPvapp: '',
    impactMnvapp: '',
    sqlMigration: '',
  });

  // Embed Code Modal State
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [embedFormType, setEmbedFormType] = useState<
    'estabelecimento' | 'usuario' | 'usuario_login' | 'mnv_cadastro' | 'mnv_login'
  >('estabelecimento');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Calculations
  const totalSalons = salons.length;
  const activeSalons = salons.filter((s) => s.status === 'active').length;
  const pendingSalons = salons.filter((s) => s.status === 'pending').length;
  const verifiedSalons = salons.filter((s) => s.isVerified).length;
  const activeRadarSlots = slots.filter((s) => s.status === 'available').length;
  const todayAppointments = appointments.length;
  const totalVolumeBRL = appointments.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Tenant Moderation Handlers
  const handleApproveSalon = (salonId: string) => {
    setSalons((prev) =>
      prev.map((s) => (s.id === salonId ? { ...s, status: 'active', suspensionReason: undefined } : s))
    );
    showToast('Estabelecimento APROVADO com sucesso no cluster Supabase.');
  };

  const handleToggleVerification = (salonId: string) => {
    setSalons((prev) =>
      prev.map((s) => {
        if (s.id === salonId) {
          const nextState = !s.isVerified;
          return { ...s, isVerified: nextState };
        }
        return s;
      })
    );
    showToast('Selo de Verificado atualizado no banco.');
  };

  const handleOpenEditSalon = (salon: Salon) => {
    setEditingSalon(salon);
    setEditFormData({
      name: salon.name,
      tradeName: salon.tradeName,
      cnpjCpf: salon.cnpjCpf,
      slug: salon.slug,
      phone: salon.phone,
      city: salon.city,
      state: salon.state,
      address: salon.address,
      category: salon.category,
      status: salon.status,
    });
  };

  const handleSaveSalonEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSalon) return;

    setSalons((prev) =>
      prev.map((s) => (s.id === editingSalon.id ? ({ ...s, ...editFormData } as Salon) : s))
    );
    setEditingSalon(null);
    showToast('Dados cadastrais master atualizados com sucesso no Supabase.');
  };

  const handleConfirmSuspension = () => {
    if (!suspendingSalon) return;
    setSalons((prev) =>
      prev.map((s) =>
        s.id === suspendingSalon.id
          ? { ...s, status: 'suspended', suspensionReason: suspensionReason || 'Suspensão manual via Governança Master.' }
          : s
      )
    );
    setSuspendingSalon(null);
    setSuspensionReason('');
    showToast('Estabelecimento suspenso. Vagas relâmpago ocultadas em pvapp.');
  };

  const handleReactivateSalon = (salonId: string) => {
    setSalons((prev) =>
      prev.map((s) => (s.id === salonId ? { ...s, status: 'active', suspensionReason: undefined } : s))
    );
    showToast('Estabelecimento reativado com status ativo.');
  };

  const handleCancelSlot = (slotId: string) => {
    setSlots((prev) => prev.map((sl) => (sl.id === slotId ? { ...sl, status: 'expired' } : sl)));
    showToast('Vaga relâmpago expirada pela moderação.');
  };

  const handleCreateCommunique = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `com-00${communiques.length + 1}`;
    const code = `COM-2026-00${communiques.length + 1}`;

    const created: TechnicalCommunique = {
      id: newId,
      code,
      title: newCommunique.title,
      scope: newCommunique.scope,
      affectedApps: ['pvapp', 'mnvapp'],
      impactPvapp: newCommunique.impactPvapp,
      impactMnvapp: newCommunique.impactMnvapp,
      sqlMigration: newCommunique.sqlMigration,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'Engenheiro Chefe de Software (admvapp)',
    };

    setCommuniques([created, ...communiques]);
    setIsNewCommuniqueOpen(false);
    setNewCommunique({
      title: '',
      scope: 'schema',
      impactPvapp: '',
      impactMnvapp: '',
      sqlMigration: '',
    });
    showToast('COMUNICADO TÉCNICO OFICIAL emitido e registrado (7º Mandamento cumprido).');
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copiado para a área de transferência!`);
  };

  // Filtered salons
  const filteredSalons = salons.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      s.tradeName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      s.cnpjCpf.includes(tenantSearch) ||
      s.city.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      s.slug.toLowerCase().includes(tenantSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Poppins']">
      {/* 🧭 HEADER MASTER CORPORATIVO */}
      <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VagouOfficialLogo size="md" variant="icon" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">adm.vagouapp.com</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                  Admin Master
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Governança Soberana, Auditoria de Tenants & Infraestrutura
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Tríade VagouApp:</span>
              <span className="text-emerald-400 font-medium">pvapp</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium">mnvapp</span>
              <span className="text-slate-600">·</span>
              <span className="text-white font-bold">admvapp</span>
            </div>

            <button
              type="button"
              onClick={() => setIsEmbedModalOpen(true)}
              className="px-3 py-1.5 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/25 transition flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
              title="Obter código de incorporação iframe para a Tríade"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Código Embed</span>
            </button>

            {onBackToGateway && (
              <button
                type="button"
                onClick={onBackToGateway}
                className="px-3 py-1.5 rounded-[4px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gateway vagouapp.com</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 🎯 SUB-NAV TABS BAR */}
      <nav className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#20C933] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard Executivo</span>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'tenants'
                ? 'bg-[#20C933] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Governança de Estabelecimentos</span>
            {pendingSalons > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] tabular-nums ${
                  activeTab === 'tenants' ? 'bg-black/30 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {pendingSalons}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#20C933] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Auditoria do Radar ({activeRadarSlots})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#20C933] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Agendamentos Globais ({todayAppointments})</span>
          </button>

          <button
            onClick={() => setActiveTab('infra')}
            className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'infra'
                ? 'bg-[#20C933] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Infra & DNS Cloudflare</span>
          </button>

          <button
            onClick={() => setActiveTab('communiques')}
            className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'communiques'
                ? 'bg-[#20C933] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>7º Mandamento (Comunicados)</span>
          </button>
        </div>
      </nav>

      {/* 🔔 BANNER DE ALERTA OPERACIONAL QUANDO HÁ PENDÊNCIAS */}
      {pendingSalons > 0 && activeTab !== 'tenants' && (
        <div className="bg-amber-950/30 border-b border-amber-500/30 px-4 sm:px-8 py-2 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-300 max-w-7xl mx-auto w-full">
            <BadgeAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Fila de Moderação:</strong> Existem {pendingSalons} salões aguardando homologação cadastral no Supabase.
            </span>
            <button
              onClick={() => {
                setActiveTab('tenants');
                setStatusFilter('pending');
              }}
              className="ml-auto underline hover:text-white cursor-pointer"
            >
              Verificar agora →
            </button>
          </div>
        </div>
      )}

      {/* 🚀 CONTEÚDO PRINCIPAL DINÂMICO */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD EXECUTIVO */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Painel Executivo da Tríade
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Métricas em tempo real integradas ao cluster unificado Supabase e Cloudflare Edge.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewCommuniqueOpen(true)}
                  className="px-4 py-2 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <FileCode2 className="w-4 h-4 text-white" />
                  <span className="text-white">Emitir Comunicado Técnico</span>
                </button>
              </div>
            </div>

            {/* GRID DE KPIS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Total de Salões</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white tabular-nums">{totalSalons}</span>
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1">Tenants registrados</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Salões Ativos</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">{activeSalons}</span>
                  <span className="text-xs text-emerald-500 font-bold">
                    {Math.round((activeSalons / totalSalons) * 100)}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">Operando no ecossistema</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Fila Moderação</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-400 tabular-nums">{pendingSalons}</span>
                  <BadgeAlert className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[11px] text-amber-400/80 mt-1">Aguardando auditoria</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Selos Verificados</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white tabular-nums">{verifiedSalons}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1">is_verified: true</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Radar Imediato</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">{activeRadarSlots}</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1">Vagas disponíveis hoje</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-4 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">GMV Diário</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-black text-white tabular-nums">
                    R$ {totalVolumeBRL.toFixed(0)}
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1">{todayAppointments} agendamentos</span>
              </div>
            </div>

            {/* SEÇÃO 2 COLUNAS: FILA DE MODERAÇÃO RÁPIDA & RADAR DE VAGAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MODERAÇÃO RÁPIDA */}
              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-bold text-white text-base">Fila Prioritária de Moderação</h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('tenants');
                      setStatusFilter('pending');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver todos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {salons.filter((s) => s.status === 'pending').length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                    <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                    <p className="font-medium text-slate-300">Nenhum estabelecimento pendente!</p>
                    <p>Todos os cadastros foram homologados pela equipe.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {salons
                      .filter((s) => s.status === 'pending')
                      .map((salon) => (
                        <div
                          key={salon.id}
                          className="p-3.5 rounded-[4px] bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{salon.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                {salon.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              {salon.city} - {salon.state} · CNPJ: {salon.cnpjCpf}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleApproveSalon(salon.id)}
                              className="flex-1 sm:flex-none px-3 py-1.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span className="text-white">Aprovar</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditSalon(salon)}
                              className="px-2.5 py-1.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                              title="Auditar dados"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* RADAR DE VAGAS AO VIVO */}
              <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-bold text-white text-base">Radar de Vagas Imediatas (Hoje)</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('radar')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Auditar Radar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {slots.slice(0, 4).map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-[4px] bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{slot.serviceName}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              slot.status === 'available'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : slot.status === 'booked'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {slot.status === 'available' ? 'Disponível' : slot.status === 'booked' ? 'Reservado' : 'Expirado'}
                          </span>
                        </div>
                        <p className="text-slate-400">
                          {slot.salonName} · {slot.professionalName} · {slot.slotTime}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="line-through text-slate-500 text-[11px] block">
                          R$ {slot.originalPrice.toFixed(0)}
                        </span>
                        <span className="text-emerald-400 font-bold tabular-nums">
                          R$ {slot.discountPrice.toFixed(0)} (-{slot.discountPercent}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COMUNICADO TÉCNICO OFICIAL MAIS RECENTE */}
            <div className="bg-slate-900 border border-slate-800 rounded-[4px] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">O 7º Mandamento em Ação: Último Comunicado Técnico</h3>
                    <p className="text-[11px] text-slate-400">Sincronização mandante com pvapp e mnvapp</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('communiques')}
                  className="px-3 py-1 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition cursor-pointer"
                >
                  Ver todos os Comunicados
                </button>
              </div>

              {communiques[0] && (
                <div className="p-4 rounded-[4px] bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold">{communiques[0].code}</span>
                    <span className="text-slate-400">{communiques[0].publishedAt}</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">{communiques[0].title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-slate-300">
                    <div className="p-2.5 rounded-[4px] bg-slate-900 border border-slate-800">
                      <strong className="text-emerald-400 block mb-1">Impacto pvapp (Consumidor):</strong>
                      <p>{communiques[0].impactPvapp}</p>
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-slate-900 border border-slate-800">
                      <strong className="text-emerald-400 block mb-1">Impacto mnvapp (Parceiro):</strong>
                      <p>{communiques[0].impactMnvapp}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GOVERNANÇA DE ESTABELECIMENTOS (TENANTS) */}
        {/* ========================================================================= */}
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Governança de Estabelecimentos (Tenants)
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Triagem de cadastros, validação fiscal, concessão de Selo Verificado e edição cadastral no Supabase.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Exibindo <strong className="text-white tabular-nums">{filteredSalons.length}</strong> de {salons.length} salões
                </span>
              </div>
            </div>

            {/* FILTROS E BUSCA */}
            <div className="p-4 rounded-[4px] bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome fantasia, razão social, CNPJ ou cidade..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-[4px] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="pending">Moderação Pendente</option>
                    <option value="active">Ativo (Homologado)</option>
                    <option value="suspended">Suspenso</option>
                    <option value="incomplete">Incompleto</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Categoria:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-[4px] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">Todas as Categorias</option>
                    <option value="barbearia">Barbearia</option>
                    <option value="salao">Salão de Beleza</option>
                    <option value="estetica">Clínica Estética</option>
                    <option value="esmalteria">Esmalteria</option>
                    <option value="spa">Spa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABELA DE ESTABELECIMENTOS */}
            <div className="bg-slate-900 border border-slate-800 rounded-[4px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                      <th className="py-3 px-4">Estabelecimento / Razão Social</th>
                      <th className="py-3 px-4">CNPJ / CPF</th>
                      <th className="py-3 px-4">Localização & Contato</th>
                      <th className="py-3 px-4">Status Supabase</th>
                      <th className="py-3 px-4">Selo Verificado</th>
                      <th className="py-3 px-4">Atividade</th>
                      <th className="py-3 px-4 text-right">Ações Master</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredSalons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          Nenhum estabelecimento encontrado com os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredSalons.map((salon) => (
                        <tr key={salon.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white text-sm">{salon.name}</span>
                                  {salon.isVerified && (
                                    <span title="Verificado">
                                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-slate-400 text-[11px] block">{salon.tradeName}</span>
                                <span className="font-mono text-slate-500 text-[10px]">/{salon.slug}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300 tabular-nums">
                            {salon.cnpjCpf}
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            <div>
                              <span>{salon.city} - {salon.state}</span>
                              <span className="text-slate-500 text-[11px] block">{salon.phone}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                salon.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : salon.status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : salon.status === 'suspended'
                                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {salon.status}
                            </span>
                            {salon.suspensionReason && (
                              <p className="text-[10px] text-red-400 mt-1 max-w-xs truncate" title={salon.suspensionReason}>
                                Motivo: {salon.suspensionReason}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleVerification(salon.id)}
                              className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                                salon.isVerified
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                              }`}
                              title="Clique para alternar o Selo Oficial de Verificado"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{salon.isVerified ? 'Verificado' : 'Não verificado'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300 tabular-nums">
                            <div>
                              <span className="text-emerald-400 font-bold">{salon.activeSlotsCount} vagas</span>
                              <span className="text-slate-400 text-[11px] block">{salon.totalAppointments} agends.</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {salon.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveSalon(salon.id)}
                                  className="px-2.5 py-1.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition flex items-center gap-1 cursor-pointer"
                                  title="Aprovar Cadastro"
                                >
                                  <Check className="w-3.5 h-3.5 text-white" />
                                  <span className="text-white">Aprovar</span>
                                </button>
                              )}

                              {salon.status === 'suspended' ? (
                                <button
                                  onClick={() => handleReactivateSalon(salon.id)}
                                  className="px-2.5 py-1.5 rounded-[4px] bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-semibold border border-emerald-500/40 transition flex items-center gap-1 cursor-pointer"
                                  title="Reativar Salão"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Reativar</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSuspendingSalon(salon);
                                    setSuspensionReason('');
                                  }}
                                  className="p-1.5 rounded-[4px] bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition cursor-pointer"
                                  title="Suspender Estabelecimento"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setEmbedFormType('estabelecimento');
                                  setIsEmbedModalOpen(true);
                                }}
                                className="p-1.5 rounded-[4px] bg-slate-800 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 transition cursor-pointer"
                                title="Gerar / Ver Código Embed deste Salão"
                              >
                                <Code className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleOpenEditSalon(salon)}
                                className="p-1.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                                title="Editar Dados Master no Banco"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUDITORIA DO RADAR & VAGAS RELÂMPAGO */}
        {/* ========================================================================= */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Auditoria do Radar de Vagas Relâmpago
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Horários ociosos anunciados por parceiros em seunegocio.vagouapp.com com transmissão para portal.vagouapp.com.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  {activeRadarSlots} Vagas Imediatas Ativas
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[4px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                      <th className="py-3 px-4">Serviço / Vaga</th>
                      <th className="py-3 px-4">Estabelecimento</th>
                      <th className="py-3 px-4">Profissional</th>
                      <th className="py-3 px-4">Horário Anunciado</th>
                      <th className="py-3 px-4">Preço Original</th>
                      <th className="py-3 px-4">Preço Relâmpago (Radar)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {slots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-bold text-white">{slot.serviceName}</td>
                        <td className="py-3.5 px-4 text-slate-300">{slot.salonName}</td>
                        <td className="py-3.5 px-4 text-slate-400">{slot.professionalName}</td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">{slot.slotTime}</td>
                        <td className="py-3.5 px-4 text-slate-500 line-through tabular-nums">
                          R$ {slot.originalPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 tabular-nums">
                          R$ {slot.discountPrice.toFixed(2)}{' '}
                          <span className="text-[10px] text-emerald-500 font-semibold">
                            (-{slot.discountPercent}%)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              slot.status === 'available'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : slot.status === 'booked'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {slot.status === 'available'
                              ? 'Disponível no Mapa'
                              : slot.status === 'booked'
                              ? 'Reservado'
                              : 'Expirado'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {slot.status === 'available' && (
                            <button
                              onClick={() => handleCancelSlot(slot.id)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 text-xs transition cursor-pointer"
                              title="Encerrar Vaga Relâmpago"
                            >
                              Encerrar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AGENDAMENTOS GLOBAIS */}
        {/* ========================================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Auditoria Global de Agendamentos
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Transações e reservas originadas em portal.vagouapp.com concluídas nos salões parceiros de seunegocio.vagouapp.com.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-[4px] bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  GMV Auditado: <strong className="text-emerald-400 tabular-nums">R$ {totalVolumeBRL.toFixed(2)}</strong>
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[4px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                      <th className="py-3 px-4">ID / Data & Hora</th>
                      <th className="py-3 px-4">Cliente (pvapp)</th>
                      <th className="py-3 px-4">Salão Parceiro (mnvapp)</th>
                      <th className="py-3 px-4">Serviço & Especialista</th>
                      <th className="py-3 px-4">Valor Total</th>
                      <th className="py-3 px-4 text-right">Status Reserva</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-slate-400 block">{apt.id}</span>
                          <span className="text-white font-medium">{apt.scheduledAt}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{apt.customerName}</span>
                          <span className="text-slate-500 text-[11px]">{apt.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{apt.salonName}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-white font-medium block">{apt.serviceName}</span>
                          <span className="text-slate-400 text-[11px]">Prof: {apt.professionalName}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400 tabular-nums">
                          R$ {apt.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              apt.status === 'confirmed'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : apt.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {apt.status === 'confirmed'
                              ? 'Confirmado'
                              : apt.status === 'completed'
                              ? 'Concluído'
                              : 'Cancelado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: INFRAESTRUTURA E DNS CLOUDFLARE */}
        {/* ========================================================================= */}
        {activeTab === 'infra' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Infraestrutura & Monitoramento de Rotas
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Status de conectividade com o cluster Supabase, rotas Cloudflare Workers (*.vagouapp.com) e SSL.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-[4px] bg-emerald-400"></span>
                  Todos os Sistemas Operacionais
                </span>
              </div>
            </div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {infraChecks.map((check, idx) => (
                <div key={idx} className="p-4 rounded-[4px] bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{check.service}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      {check.status}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-400 bg-slate-950 p-2 rounded-[4px] border border-slate-800/80">
                    {check.target}
                  </div>
                  <p className="text-xs text-slate-300">{check.details}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Latência: <strong className="text-emerald-400 font-mono">{check.latencyMs}ms</strong></span>
                    <span>{check.lastChecked}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* WRANGLER TOML CONFIGURATION PREVIEW */}
            <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Configuração Cloudflare Workers (wrangler.toml)</h3>
                </div>
                <button
                  onClick={() =>
                    handleCopyText(
                      `name = "vagouapp-gateway"\ncompatibility_date = "2026-10-15"\n[site]\nbucket = "./dist"\n[[routes]]\npattern = "vagouapp.com/*"\nzone_name = "vagouapp.com"\n[[routes]]\npattern = "www.vagouapp.com/*"\nzone_name = "vagouapp.com"\n[[routes]]\npattern = "adm.vagouapp.com/*"\nzone_name = "vagouapp.com"`,
                      'Configuração wrangler.toml'
                    )
                  }
                  className="px-3 py-1 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar wrangler.toml</span>
                </button>
              </div>

              <pre className="p-4 rounded-[4px] bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
{`name = "vagouapp-gateway"
compatibility_date = "2026-10-15"

[site]
bucket = "./dist"

[[routes]]
pattern = "vagouapp.com/*"
zone_name = "vagouapp.com"

[[routes]]
pattern = "www.vagouapp.com/*"
zone_name = "vagouapp.com"

[[routes]]
pattern = "adm.vagouapp.com/*"
zone_name = "vagouapp.com"`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CENTRAL DO 7º MANDAMENTO (COMUNICADOS TÉCNICOS) */}
        {/* ========================================================================= */}
        {activeTab === 'communiques' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-xs uppercase">
                    Mandatório
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    O 7º Mandamento: Comunicados Oficiais
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                  “Toda e qualquer alteração de schema no Supabase, colunas, status, triggers, rotas ou design system realizada neste projeto DEVE OBRIGATORIAMENTE gerar um Comunicado Técnico Oficial detalhado e formal para os outros dois projetos da Tríade (pvapp E mnvapp). Zero pontas soltas.”
                </p>
              </div>

              <div>
                <button
                  onClick={() => setIsNewCommuniqueOpen(true)}
                  className="px-4 py-2.5 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <FileCode2 className="w-4 h-4 text-white" />
                  <span className="text-white">Redigir Novo Comunicado</span>
                </button>
              </div>
            </div>

            {/* LISTA DE COMUNICADOS */}
            <div className="space-y-4">
              {communiques.map((com) => (
                <div
                  key={com.id}
                  className="p-5 rounded-[4px] bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {com.code}
                      </span>
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                        Escopo: {com.scope}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Destinatários: <strong className="text-emerald-400">pvapp</strong> + <strong className="text-emerald-400">mnvapp</strong></span>
                      <span>·</span>
                      <span>{com.publishedAt}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {com.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Autor: {com.author}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-[4px] bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-emerald-400 block">
                        📱 Impacto em pvapp (Consumidor / Marketplace):
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{com.impactPvapp}</p>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-emerald-400 block">
                        ✂️ Impacto em mnvapp (Parceiro / Salão de Beleza):
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{com.impactMnvapp}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-400">Script de Migração SQL Homologado:</span>
                      <button
                        onClick={() => handleCopyText(com.sqlMigration, 'Script SQL de Migração')}
                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar SQL</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-[4px] bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
                      {com.sqlMigration}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: EDIÇÃO MASTER DE DADOS CADASTRAIS */}
      {/* ========================================================================= */}
      {editingSalon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-[4px] max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Edição Master de Estabelecimento (Supabase)</h3>
              </div>
              <button
                onClick={() => setEditingSalon(null)}
                className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSalonEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Nome Fantasia (Público)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Razão Social (Fiscal)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.tradeName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, tradeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">CNPJ / CPF</label>
                  <input
                    type="text"
                    required
                    value={editFormData.cnpjCpf || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, cnpjCpf: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Slug da Rota (/slug)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.slug || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Categoria</label>
                  <select
                    value={editFormData.category || 'salao'}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="barbearia">Barbearia</option>
                    <option value="salao">Salão de Beleza</option>
                    <option value="estetica">Estética</option>
                    <option value="esmalteria">Esmalteria</option>
                    <option value="spa">Spa</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Cidade</label>
                  <input
                    type="text"
                    required
                    value={editFormData.city || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Estado (UF)</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={editFormData.state || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Endereço Completo</label>
                <input
                  type="text"
                  required
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSalon(null)}
                  className="px-4 py-2 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Salvar Alterações no Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUSPENSÃO DE ESTABELECIMENTO */}
      {/* ========================================================================= */}
      {suspendingSalon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[4px] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 border-b border-slate-800 pb-3">
              <Ban className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Suspender Estabelecimento</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Você está prestes a suspender <strong className="text-white">{suspendingSalon.name}</strong>. Esta ação bloqueará a publicação de vagas relâmpago no Radar e ocultará o salão em portal.vagouapp.com.
            </p>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Motivo Formal da Suspensão</label>
              <textarea
                rows={3}
                placeholder="Informe a justificativa da suspensão para fins de auditoria..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-[4px] text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuspendingSalon(null)}
                className="px-4 py-2 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspension}
                className="px-4 py-2 rounded-[4px] bg-red-600 hover:bg-red-500 text-xs text-white font-bold transition cursor-pointer"
              >
                Confirmar Suspensão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO COMUNICADO TÉCNICO OFICIAL (7º MANDAMENTO) */}
      {/* ========================================================================= */}
      {isNewCommuniqueOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-[4px] max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Redigir Comunicado Técnico Oficial (7º Mandamento)</h3>
              </div>
              <button
                onClick={() => setIsNewCommuniqueOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunique} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Título da Mudança</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Criação da tabela commission_rules e novos status de agendamento"
                  value={newCommunique.title}
                  onChange={(e) => setNewCommunique({ ...newCommunique, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Escopo Técnico</label>
                <select
                  value={newCommunique.scope}
                  onChange={(e) => setNewCommunique({ ...newCommunique, scope: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="schema">Alteração de Schema (Tabelas / Colunas)</option>
                  <option value="enum">Alteração de Enums de Banco</option>
                  <option value="route">Alteração de Rotas / Domínios</option>
                  <option value="design_system">Atualização no Design System Oficial</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Impacto em pvapp (Consumidor)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Como o portal.vagouapp.com deve reagir..."
                    value={newCommunique.impactPvapp}
                    onChange={(e) => setNewCommunique({ ...newCommunique, impactPvapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Impacto em mnvapp (Parceiro)</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Como o seunegocio.vagouapp.com deve reagir..."
                    value={newCommunique.impactMnvapp}
                    onChange={(e) => setNewCommunique({ ...newCommunique, impactMnvapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-[4px] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Script de Migração SQL Homologado</label>
                <textarea
                  rows={4}
                  required
                  placeholder="-- Instruções SQL DDL ou DML&#10;ALTER TABLE ...&#10;CREATE INDEX IF NOT EXISTS ..."
                  value={newCommunique.sqlMigration}
                  onChange={(e) => setNewCommunique({ ...newCommunique, sqlMigration: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-[4px] font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewCommuniqueOpen(false)}
                  className="px-4 py-2 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Publicar Comunicado Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CÓDIGO DE INCORPORAÇÃO EMBED (SINGLE SOURCE OF TRUTH) */}
      {/* ========================================================================= */}
      {isEmbedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-[4px] max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Código de Incorporação Embed</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmbedModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-[4px] hover:bg-slate-800 transition cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1.5">Selecione o Formulário Oficial:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmbedFormType('estabelecimento')}
                    className={`p-2.5 rounded-[4px] border text-left transition cursor-pointer ${
                      embedFormType === 'estabelecimento'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Estabelecimento - Cadastro de Salão
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbedFormType('usuario')}
                    className={`p-2.5 rounded-[4px] border text-left transition cursor-pointer ${
                      embedFormType === 'usuario'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Usuário - Cadastro de Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbedFormType('usuario_login')}
                    className={`p-2.5 rounded-[4px] border text-left transition cursor-pointer ${
                      embedFormType === 'usuario_login'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Usuário - Login de Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbedFormType('mnv_cadastro')}
                    className={`p-2.5 rounded-[4px] border text-left transition cursor-pointer ${
                      embedFormType === 'mnv_cadastro'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Parceiro - Cadastro Meu Negócio
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbedFormType('mnv_login')}
                    className={`p-2.5 rounded-[4px] border text-left transition cursor-pointer ${
                      embedFormType === 'mnv_login'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Parceiro - Login Meu Negócio
                  </button>
                </div>
              </div>

              {/* CALLOUT: SINGLE SOURCE OF TRUTH */}
              <div className="p-3.5 rounded-[4px] bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-white font-bold block">Single Source of Truth</strong>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Ao utilizar este iframe, qualquer alteração cadastral, novos campos ou regras de validação aplicadas aqui no Admin são refletidas imediatamente em <strong>vagouapp.com</strong>, <strong>portal.vagouapp.com</strong> e <strong>seunegocio.vagouapp.com</strong>.
                  </p>
                </div>
              </div>

              {/* CÓDIGO SNIPPET */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Copie e cole este iframe no portal.vagouapp.com, seunegocio.vagouapp.com ou vagouapp.com:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const code = `<iframe src="https://adm.vagouapp.com/embed?form=${embedFormType}&direct=true" width="100%" height="750" frameborder="0" allow="clipboard-write; geolocation"></iframe>`;
                      navigator.clipboard.writeText(code);
                      showToast('Código iframe copiado para a área de transferência!');
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-[4px] text-slate-300 font-mono text-[11px] overflow-x-auto selection:bg-[#20C933] selection:text-white">
{`<iframe
  src="https://adm.vagouapp.com/embed?form=${embedFormType}"
  width="100%"
  height="750"
  frameborder="0"
  allow="clipboard-write; geolocation"
></iframe>`}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <a
                  href={`https://adm.vagouapp.com/embed?form=${embedFormType}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Testar URL direta em nova aba</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsEmbedModalOpen(false)}
                  className="px-5 py-2 rounded-[4px] bg-[#20C933] hover:bg-[#1bb32d] text-white font-bold transition cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOAST FLUTUANTE DE FEEDBACK */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 shadow-2xl rounded-[4px] px-4 py-3 flex items-center gap-3 text-xs text-white animate-fade-in">
          <div className="w-5 h-5 rounded-[4px] bg-[#20C933] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 🛡️ RODAPÉ CORPORATIVO MASTER */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-4 px-4 sm:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VagouApp Admin Master · adm.vagouapp.com · Governança Soberana</span>
          <span className="font-mono text-[11px] text-slate-400">
            PostgreSQL Cluster: sa-east-1 · Cloudflare Edge: Ativo · RLS: Habilitado
          </span>
        </div>
      </footer>
    </div>
  );
};
