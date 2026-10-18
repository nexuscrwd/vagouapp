import { createClient } from '@supabase/supabase-js';
import { initialSalons } from '../data/mockDatabase';

const DEFAULT_SUPABASE_URL = 'https://xemenxdhuoekytyhmgyt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlbWVueGRodW9la3l0eWhtZ3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMDE2MzAsImV4cCI6MjEwNTc3NzYzMH0.P-q6bQspwuQNhub08hjWmsjLrugr3CVA1NIdznWJxuo';

function resolveSupabaseUrl(): string {
  const raw = import.meta.env.VITE_SUPABASE_URL;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const trimmed = raw.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed.replace(/\/$/, '');
    }
    if (trimmed.startsWith('eyJ')) {
      try {
        const payload = JSON.parse(atob(trimmed.split('.')[1]));
        if (payload?.ref) {
          return `https://${payload.ref}.supabase.co`;
        }
      } catch {
        // Ignore parse error and fallback
      }
    }
  }
  return DEFAULT_SUPABASE_URL;
}

function resolveSupabaseAnonKey(): string {
  const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (typeof rawKey === 'string' && rawKey.trim().startsWith('eyJ')) {
    return rawKey.trim();
  }
  const rawUrl = import.meta.env.VITE_SUPABASE_URL;
  if (typeof rawUrl === 'string' && rawUrl.trim().startsWith('eyJ')) {
    return rawUrl.trim();
  }
  return DEFAULT_SUPABASE_ANON_KEY;
}

export const supabaseUrl = resolveSupabaseUrl();
export const supabaseAnonKey = resolveSupabaseAnonKey();

const ADMIN_BASE_URL =
  import.meta.env.VITE_ADMIN_FORMS_URL || 'https://adm.vagouapp.com';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Retorna a lista ordenada de URLs públicas do logotipo oficial no Supabase Storage
 * e no ecossistema VagouApp.
 */
export function getSupabaseLogoCandidates(): string[] {
  const mediaLogo = supabase.storage
    .from('media')
    .getPublicUrl('vagou_logo_transparente_texto_branco.png').data.publicUrl;
  const brandingLogo = supabase.storage
    .from('branding')
    .getPublicUrl('vagou-logo.png').data.publicUrl;
  const assetsLogo = supabase.storage
    .from('assets')
    .getPublicUrl('logo.png').data.publicUrl;

  return [
    import.meta.env.VITE_SUPABASE_LOGO_URL,
    brandingLogo,
    assetsLogo,
    mediaLogo,
    `${ADMIN_BASE_URL}/logo.png`,
    `${ADMIN_BASE_URL}/vagou-logo.png`,
    '/logo.png',
    '/vagou-logo.png',
    '/logo_light.png',
  ].filter(Boolean) as string[];
}

/**
 * Consulta dinamicamente os buckets públicos do Supabase Storage ('branding', 'media', 'assets')
 * para localizar o arquivo de logo ativo, caso tenha sido enviado com outro nome.
 */
export async function fetchActiveSupabaseLogoUrl(): Promise<string | null> {
  for (const bucket of ['branding', 'media', 'assets']) {
    try {
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list('', { limit: 50 });
      if (!error && Array.isArray(files) && files.length > 0) {
        const logoFile = files.find(
          (f) =>
            f.name &&
            /\.(png|svg|webp)$/i.test(f.name) &&
            /logo|vagou/i.test(f.name)
        );
        if (logoFile) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(logoFile.name);
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      }
    } catch {
      // Prossegue para o próximo bucket
    }
  }
  return null;
}

/**
 * Busca de estabelecimentos ativos no Supabase ou na API Pública do Admin Master (admvapp)
 */
export async function fetchClientSalons() {
  // 1. Tenta via cliente Supabase se a anon key estiver configurada
  if (import.meta.env.VITE_SUPABASE_ANON_KEY && !supabaseAnonKey.includes('placeholder')) {
    try {
      const { data, error } = await supabase
        .from('salons')
        .select(
          'id, trade_name, slug, category, address, neighborhood, city, logo_url, rating_avg, primary_color, branding, status, is_verified'
        )
        .eq('status', 'active');

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Prossegue para o endpoint público do Admin Master
    }
  }

  // 2. Tenta via API Pública do Admin Master (admvapp) com CORS
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/api/public/salons`);
    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.salons) && json.salons.length > 0) {
        return json.salons;
      }
    }
  } catch {
    // Fallback silencioso para dados locais
  }

  return initialSalons;
}

/**
 * Busca de serviços no Supabase ou na API Pública do Admin Master (admvapp)
 */
export async function fetchClientServices(salonId?: string) {
  if (import.meta.env.VITE_SUPABASE_ANON_KEY && !supabaseAnonKey.includes('placeholder')) {
    try {
      let query = supabase.from('services').select('*');
      if (salonId) {
        query = query.eq('salon_id', salonId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data;
      }
    } catch {
      // Prossegue para o endpoint público do Admin Master
    }
  }

  try {
    const url = salonId
      ? `${ADMIN_BASE_URL}/api/public/services?salon_id=${encodeURIComponent(salonId)}`
      : `${ADMIN_BASE_URL}/api/public/services`;
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.services)) {
        return json.services;
      }
    }
  } catch {
    // Fallback silencioso
  }

  return [];
}
