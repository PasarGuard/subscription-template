export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
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

