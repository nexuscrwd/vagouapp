export interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('VagouApp Gateway & Admin Master Hub', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
