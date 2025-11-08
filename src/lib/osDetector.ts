/**
 * OS Detection utility
 * Detects the current operating system based on user agent and platform
 */

export type OperatingSystem = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'unknown';

export function detectOS(): OperatingSystem {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || '';
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check for modern userAgentData API (more accurate)
  const userAgentData = (navigator as any).userAgentData;
  if (userAgentData?.platform) {
    const uaPlatform = userAgentData.platform.toLowerCase();
    if (uaPlatform.includes('android')) {
      return 'android';
    }
    if (uaPlatform.includes('ios') || uaPlatform === 'iphone' || uaPlatform === 'ipad') {
      return 'ios';
    }
  }

  // iOS detection (before Android to avoid conflicts)
  if (/iphone|ipad|ipod/.test(userAgent) || (platform === 'macintel' && 'ontouchend' in document)) {
    return 'ios';
  }

  // Android detection - more comprehensive
  // Check userAgent first
  if (/android/.test(userAgent)) {
    return 'android';
  }
  
  // Check platform string for Android indicators
  if (platform.includes('android')) {
    return 'android';
  }
  
  // Heuristic: Touch device with Linux platform is likely Android (tablet/phone)
  // Android tablets often report platform as "Linux armv7l" or similar
  if (isTouchDevice && (platform.includes('linux') || /linux/.test(userAgent))) {
    // Additional check: mobile-like screen size or mobile userAgent patterns
    const hasMobileUA = /mobile|tablet|phone/.test(userAgent);
    const isMobileLike = hasMobileUA || window.innerWidth <= 768;
    
    if (hasMobileUA || isMobileLike) {
      return 'android';
    }
  }

  // Windows detection
  if (/windows|win32|win64/.test(userAgent) || platform.includes('win')) {
    return 'windows';
  }

  // macOS detection
  if (/macintosh|mac os x|macos/.test(userAgent) || platform.includes('mac')) {
    return 'macos';
  }

  // Linux detection (only if not a touch device, to avoid false positives for Android)
  if (/linux/.test(userAgent) || platform.includes('linux')) {
    return 'linux';
  }

  return 'unknown';
}

/**
 * Maps detected OS to app platform names used in the API
 */
export function mapOSToPlatform(os: OperatingSystem): string {
  switch (os) {
    case 'windows':
      return 'windows';
    case 'macos':
    case 'ios':
      return 'ios'; // macOS and iOS use similar apps
    case 'android':
      return 'android';
    case 'linux':
      return 'linux';
    default:
      return 'other';
  }
}

/**
 * Gets the priority order for platforms based on current OS
 */
export function getPlatformPriority(currentOS: OperatingSystem): string[] {
  const currentPlatform = mapOSToPlatform(currentOS);
  
  // Start with current platform, then add others
  const baseOrder = ['ios', 'android', 'windows', 'linux', 'other'];
  const currentIndex = baseOrder.indexOf(currentPlatform);
  
  if (currentIndex === -1) {
    // If current platform not found, return default order
    return baseOrder;
  }
  
  // Move current platform to front
  const reordered = [currentPlatform, ...baseOrder.filter(p => p !== currentPlatform)];
  return reordered;
}
