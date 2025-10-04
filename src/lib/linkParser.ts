export interface ParsedLink {
  raw: string;
  protocol: 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'ss' | 'unknown';
  name: string;
  server?: string;
  port?: string;
  emoji?: string;
}

/**
 * Extracts the protocol from a proxy link
 */
export function getProtocol(link: string): ParsedLink['protocol'] {
  if (link.startsWith('vless://')) return 'vless';
  if (link.startsWith('vmess://')) return 'vmess';
  if (link.startsWith('trojan://')) return 'trojan';
  if (link.startsWith('ss://') || link.startsWith('shadowsocks://')) return 'shadowsocks';
  return 'unknown';
}

/**
 * Decodes vmess base64 configuration
 */
function decodeVmessConfig(base64Data: string): any {
  try {
    const decoded = atob(base64Data);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Extracts clean name from URL fragment (after #)
 */
function extractFragmentName(link: string): string {
  const hashIndex = link.indexOf('#');
  if (hashIndex === -1) return '';
  
  const fragment = link.substring(hashIndex + 1);
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

/**
 * Extracts name from vmess configuration
 */
function extractVmessName(link: string): string {
  const base64Data = link.replace('vmess://', '');
  const config = decodeVmessConfig(base64Data);
  return config?.ps || '';
}

/**
 * Extracts server and port from the link
 */
function extractServerInfo(link: string, protocol: string): { server?: string; port?: string } {
  try {
    // Handle vmess separately
    if (protocol === 'vmess') {
      const base64Data = link.replace('vmess://', '');
      const config = decodeVmessConfig(base64Data);
      if (config) {
        return {
          server: config.add?.trim(),
          port: config.port?.toString()
        };
      }
      return {};
    }
    
    // Remove protocol
    const withoutProtocol = link.split('://')[1];
    if (!withoutProtocol) return {};
    
    // Extract the part before @ or ? or #
    let serverPart = withoutProtocol.split('@')[1] || withoutProtocol;
    serverPart = serverPart.split('?')[0];
    serverPart = serverPart.split('#')[0];
    
    // Clean up any extra spaces
    serverPart = serverPart.trim();
    
    const [server, port] = serverPart.split(':');
    return { 
      server: server?.trim(), 
      port: port?.trim() 
    };
  } catch {
    return {};
  }
}

/**
 * Extracts country emoji from text
 */
function extractEmoji(text: string): string | undefined {
  // Match emoji pattern (most emojis are 2-4 bytes in UTF-16)
  const emojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?|[\u{2600}-\u{26FF}][\u{FE00}-\u{FE0F}]?/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches[0] : undefined;
}

/**
 * Generates a clean display name for a link
 */
function generateCleanName(rawName: string, protocol: string, index: number): string {
  if (!rawName) {
    return `${protocol.toUpperCase()} Config ${index + 1}`;
  }
  
  // Remove emoji from the name for cleaner display
  const nameWithoutEmoji = rawName.replace(/[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F300}-\u{1F9FF}][\u{FE00}-\u{FE0F}]?|[\u{2600}-\u{26FF}][\u{FE00}-\u{FE0F}]?/gu, '').trim();
  
  // Clean up common patterns
  let cleanName = nameWithoutEmoji
    .replace(/\s+/g, ' ')  // Normalize spaces
    .replace(/^\||\|$/g, '')  // Remove leading/trailing pipes
    .replace(/^[-_]+|[-_]+$/g, '')  // Remove leading/trailing dashes/underscores
    .trim();
  
  // If name is too technical or contains GB/Days info, simplify it
  if (cleanName.includes('GB') || cleanName.includes('Days Left')) {
    const parts = cleanName.split('|').map(p => p.trim());
    // Try to find the most meaningful part
    const meaningfulPart = parts.find(p => !p.includes('GB') && !p.includes('Days') && p.length > 2);
    if (meaningfulPart) {
      cleanName = meaningfulPart;
    }
  }
  
  return cleanName || `${protocol.toUpperCase()} Config ${index + 1}`;
}

/**
 * Parses a proxy link and extracts clean information
 */
export function parseLink(link: string, index: number): ParsedLink {
  // Trim the link to remove any trailing/leading whitespace
  const cleanLink = link.trim();
  
  const protocol = getProtocol(cleanLink);
  
  // Get name from fragment or vmess config
  let rawName = '';
  if (protocol === 'vmess') {
    rawName = extractVmessName(cleanLink);
  } else {
    rawName = extractFragmentName(cleanLink);
  }
  
  const { server, port } = extractServerInfo(cleanLink, protocol);
  const emoji = extractEmoji(rawName);
  const name = generateCleanName(rawName, protocol, index);
  
  return {
    raw: cleanLink,
    protocol,
    name,
    server,
    port,
    emoji,
  };
}

/**
 * Parses multiple links
 */
export function parseLinks(links: string[]): ParsedLink[] {
  return links.map((link, index) => parseLink(link, index));
}

