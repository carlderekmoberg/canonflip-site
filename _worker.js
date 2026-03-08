export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // For cloakclaw.com, serve the CloakClaw-specific page
    if (hostname === 'cloakclaw.com' || hostname === 'www.cloakclaw.com') {
      // Rewrite to /cloakclaw/ path internally
      if (url.pathname === '/' || url.pathname === '') {
        const newUrl = new URL('/cloakclaw/index.html', url.origin);
        return env.ASSETS.fetch(new Request(newUrl, request));
      }
      // For other paths (like logo), try /cloakclaw/ prefix first, then root
      const cloakUrl = new URL('/cloakclaw' + url.pathname, url.origin);
      const resp = await env.ASSETS.fetch(new Request(cloakUrl, request));
      if (resp.status === 200) return resp;
      // Fall through to root path (shared assets like logos)
      return env.ASSETS.fetch(request);
    }
    
    // For canonflip.com (or anything else), serve normally
    return env.ASSETS.fetch(request);
  }
};
