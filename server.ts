import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // 🌐 Rotas Públicas de API com suporte a CORS (Access-Control-Allow-Origin: *)
  app.use('/api/public', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // GET /api/public/salons
  app.get('/api/public/salons', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('salons')
        .select('id, trade_name, slug, category, address, neighborhood, city, logo_url, rating_avg, primary_color, branding, status, is_verified')
        .eq('status', 'active');

      if (error || !data || data.length === 0) {
        // Fallback para mock se o Supabase não estiver conectado
        const mockSalons = [
          {
            id: 'sal-001',
            trade_name: 'Barbearia Dom Cavalcanti',
            slug: 'dom-cavalcanti-itaim',
            category: 'barbearia',
            address: 'Rua Joaquim Floriano, 482 - Itaim Bibi',
            city: 'São Paulo',
            state: 'SP',
            logo_url: null,
            rating_avg: 4.9,
            status: 'active',
            is_verified: true,
          },
          {
            id: 'sal-003',
            trade_name: 'L’Atelier Concept Hair',
            slug: 'latelier-concept-jardins',
            category: 'salao',
            address: 'Alameda Lorena, 1540 - Jardins',
            city: 'São Paulo',
            state: 'SP',
            logo_url: null,
            rating_avg: 4.8,
            status: 'active',
            is_verified: true,
          },
        ];
        return res.json({ success: true, count: mockSalons.length, salons: mockSalons });
      }

      return res.json({ success: true, count: data.length, salons: data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Erro ao buscar salões' });
    }
  });

  // GET /api/public/services
  app.get('/api/public/services', async (req, res) => {
    try {
      const salonId = req.query.salon_id as string;
      let query = supabase.from('services').select('*');
      if (salonId) {
        query = query.eq('salon_id', salonId);
      }
      const { data, error } = await query;

      if (error || !data) {
        const mockServices = [
          { id: 'srv-1', salon_id: 'sal-001', name: 'Corte Degradê', price: 65.0, duration_mins: 45 },
          { id: 'srv-2', salon_id: 'sal-001', name: 'Barba Clássica', price: 45.0, duration_mins: 30 },
        ];
        return res.json({ success: true, count: mockServices.length, services: mockServices });
      }

      return res.json({ success: true, count: data.length, services: data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Erro ao buscar serviços' });
    }
  });

  // Rota de upload de logo local
  app.post('/api/upload-logo', (req, res) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ success: false, error: 'DataUrl é obrigatório' });
      }
      res.json({ success: true, message: 'Logo recebido com sucesso' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Proxy de assets do embed oficial admvapp para execução same-origin sem bloqueios de CORS
  app.use('/assets', async (req, res, next) => {
    if (req.url.includes('Bbu6UAHT') || req.url.includes('CbZ1LmtA')) {
      try {
        const remoteUrl = `https://adm.vagouapp.com/assets${req.url}`;
        const remoteRes = await fetch(remoteUrl);
        if (remoteRes.ok) {
          const contentType = remoteRes.headers.get('content-type') || (req.url.endsWith('.js') ? 'application/javascript; charset=utf-8' : 'text/css');
          res.setHeader('Content-Type', contentType);
          res.setHeader('Access-Control-Allow-Origin', '*');
          
          if (req.url.endsWith('.js')) {
            let code = await remoteRes.text();
            // Elimina a piscada inicial: inicializa 'n' sincronicamente como true se for rota de embed,
            // impedindo que o React renderize a tela de admin/login no primeiro frame antes do useEffect
            code = code.replace(
              'const[l,a]=y.useState(!1),[n,o]=y.useState(!1)',
              'const[l,a]=y.useState(!1),[n,o]=y.useState(()=>typeof window<"u"&&(window.location.search.includes("embed")||window.location.search.includes("form=")||window.location.pathname.includes("/embed")))'
            );
            return res.send(code);
          }

          const buffer = await remoteRes.arrayBuffer();
          return res.send(Buffer.from(buffer));
        }
      } catch (err) {
        console.warn('Erro ao repassar asset remoto do embed:', err);
      }
    }
    next();
  });

  // 🪟 Rota de Proxy com Injeção de Transparência do Embed Oficial do admvapp
  app.get('/api/embed-form', async (req, res) => {
    try {
      const searchParams = new URLSearchParams(req.query as any);
      searchParams.set('embed', 'true');
      searchParams.set('bg', 'transparent');

      const targetUrl = `https://adm.vagouapp.com/embed?${searchParams.toString()}`;
      const response = await fetch(targetUrl);
      let html = await response.text();

      // Injeta CSS de transparência absoluta para o efeito de vidro jateado (frosted glass)
      const injection = `
        <style>
          html, body, #root {
            background: transparent !important;
            background-color: transparent !important;
          }
        </style>
      `;

      html = html.replace('<head>', `<head>${injection}`);
      html = html.replace(/class="[^"]*bg-slate-950[^"]*"/, 'class="bg-transparent text-slate-100 antialiased"');

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.send(html);
    } catch (err: any) {
      return res.status(500).send(`Erro ao carregar formulário soberano: ${err.message}`);
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`[VagouApp Admin Master] Server running on http://localhost:${port}`);
  });
}

startServer();
