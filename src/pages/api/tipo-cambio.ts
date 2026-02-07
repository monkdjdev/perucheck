import type { APIRoute } from 'astro';
import { getTipoCambio } from '../../utils/tipoCambioService';

export const GET: APIRoute = async () => {
  try {
    const data = await getTipoCambio();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache browser 5 min
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
