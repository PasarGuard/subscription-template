export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Extract headers for /info endpoint (announce and support-url headers)
  if (url.includes('/info')) {
    const headers: Record<string, string> = {};
    
    // Extract announce, announce-url, and support-url headers
    // Check for case variations - HTTP headers are case-insensitive but we check common variations
    const announce = response.headers.get('announce') || 
                     response.headers.get('Announce') || 
                     response.headers.get('ANNOUNCE');
    const announceUrl = response.headers.get('announce-url') || 
                        response.headers.get('Announce-Url') || 
                        response.headers.get('ANNOUNCE-URL');
    const supportUrl = response.headers.get('support-url') || 
                       response.headers.get('Support-Url') || 
                       response.headers.get('SUPPORT-URL');
    
    if (announce) {
      headers['announce'] = announce;
    }
    if (announceUrl) {
      headers['announce-url'] = announceUrl;
    }
    if (supportUrl) {
      headers['support-url'] = supportUrl;
    }
    
    // Always return headers object, even if empty, so the structure is consistent
    return { data, headers };
  }
  
  return data;
};

export const textFetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.text();
};

export const getBaseUrl = () => {
  return import.meta.env.VITE_PANEL_DOMAIN || window.location.origin;
};

export const getAdjustedUrl = (subURL?: string) => {
  if (!subURL && !import.meta.env.VITE_PANEL_DOMAIN) {
    return `${window.location.origin}${window.location.pathname}`;
  }
  
  if (!subURL && import.meta.env.VITE_PANEL_DOMAIN) {
    return `${import.meta.env.VITE_PANEL_DOMAIN}${window.location.pathname}`;
  }
  
  if (import.meta.env.VITE_PANEL_DOMAIN && subURL) {
    return subURL.replace(/https?:\/\/[^/]+/, import.meta.env.VITE_PANEL_DOMAIN);
  } else if (subURL?.includes("https://")) {
    return subURL;
  }

  return `${window.location.origin}${subURL}`;
};

