export default {
  async fetch(request, env, ctx) {
    // Serve static assets with custom headers
    const response = await env.ASSETS.fetch(request);
    
    // Add custom headers for AI optimization
    const newResponse = new Response(response.body, response);
    
    // Add security headers
    newResponse.headers.set('X-Frame-Options', 'DENY');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // AI-specific headers for oath endpoints
    const url = new URL(request.url);
    if (url.pathname.includes('oath')) {
      newResponse.headers.set('Cache-Control', 'public, max-age=1800');
    } else {
      newResponse.headers.set('Cache-Control', 'public, max-age=3600');
    }
    
    // Special handling for different file types
    if (url.pathname === '/robots.txt') {
      newResponse.headers.set('Content-Type', 'text/plain');
    } else if (url.pathname === '/sitemap.xml') {
      newResponse.headers.set('Content-Type', 'application/xml');
    } else if (url.pathname.endsWith('.css')) {
      newResponse.headers.set('Content-Type', 'text/css');
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    } else if (url.pathname.endsWith('.js')) {
      newResponse.headers.set('Content-Type', 'application/javascript');
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    }
    
    return newResponse;
  },
};