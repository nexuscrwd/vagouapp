/**
 * Ponto de entrada de fallback para Cloudflare Workers Sites
 */
export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('VagouApp Gateway & Admin Master Hub', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
