-- ==============================================================================
-- 🏛️ VAGOUAPP — SCRIPT SQL OFICIAL: STORAGE & ARQUIVOS DE MÍDIA DA TRÍADE
-- ==============================================================================
-- Aplicações: admvapp (adm.vagouapp.com), pvapp (portal.vagouapp.com), mnvapp (seunegocio.vagouapp.com)
-- Objetivo: Criar bucket público de mídia no Supabase Storage e tabela de catálogo de assets.
-- Execução: Pode ser executado diretamente no SQL Editor do Dashboard Supabase.
-- ==============================================================================

-- 1. CRIAÇÃO DO BUCKET PÚBLICO NO SUPABASE STORAGE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- Limite de 50MB por arquivo
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- 2. POLÍTICAS DE SEGURANÇA (RLS) PARA O BUCKET DE MÍDIA
-- Permitir leitura pública irrestrita para qualquer usuário (anônimo ou autenticado)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Public Access Media Select'
  ) THEN
    CREATE POLICY "Public Access Media Select"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');
  END IF;
END $$;

-- Permitir upload/escrita apenas para administradores autenticados ou service role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Admin Media Insert'
  ) THEN
    CREATE POLICY "Admin Media Insert"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'media'
      AND (
        auth.role() = 'service_role' 
        OR (auth.jwt() ->> 'role') = 'super_admin'
        OR auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@vagouapp.com')
      )
    );
  END IF;
END $$;

-- Permitir exclusão apenas para super administradores
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Admin Media Delete'
  ) THEN
    CREATE POLICY "Admin Media Delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'media'
      AND (
        auth.role() = 'service_role' 
        OR (auth.jwt() ->> 'role') = 'super_admin'
      )
    );
  END IF;
END $$;

-- 3. TABELA DE CATÁLOGO CENTRAL DE ASSETS DA TRÍADE
CREATE TABLE IF NOT EXISTS public.app_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'branding', -- 'branding', 'icon', 'banner', 'showcase'
  bucket_name VARCHAR(100) NOT NULL DEFAULT 'media',
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL DEFAULT 'image/png',
  size_bytes BIGINT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS na tabela app_media
ALTER TABLE public.app_media ENABLE ROW LEVEL SECURITY;

-- Leitura pública para que pvapp, mnvapp e admvapp consumam assets oficiais
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'app_media' 
    AND policyname = 'Public Read App Media'
  ) THEN
    CREATE POLICY "Public Read App Media"
    ON public.app_media FOR SELECT
    USING (true);
  END IF;
END $$;

-- 4. SEED: CADASTRO DO LOGOTIPO OFICIAL NO CATÁLOGO
-- Substitua [SEU_PROJECT_REF] pelo ID do seu projeto Supabase (ex: abcdefghijklmnopqrst)
INSERT INTO public.app_media (
  asset_key,
  name,
  category,
  bucket_name,
  file_path,
  public_url,
  mime_type,
  metadata
)
VALUES (
  'vagou_official_logo',
  'Logo VagouApp Oficial (Transparente com Texto Branco)',
  'branding',
  'media',
  'vagou_logo_transparente_texto_branco.png',
  'https://xemenxdhuoekytyhmgyt.supabase.co/storage/v1/object/public/media/vagou_logo_transparente_texto_branco.png',
  'image/png',
  jsonb_build_object(
    'description', 'Logotipo oficial da Tríade VagouApp com checkmark verde e texto branco para superfícies escuras',
    'usage', 'Gateway Hub, Header e Telas de Login',
    'version', '1.0'
  )
)
ON CONFLICT (asset_key) DO UPDATE SET
  public_url = EXCLUDED.public_url,
  updated_at = now();

COMMENT ON TABLE public.app_media IS 'Catálogo central de arquivos de mídia e logos corporativos do VagouApp';
