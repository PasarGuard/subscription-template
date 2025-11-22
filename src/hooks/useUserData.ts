import useSWR from 'swr';
import { fetcher, textFetcher, getBaseUrl } from '@/lib/fetcher';
import useSWRImmutable from 'swr/immutable'
import type { UserInfo, ConfigData, ChartData, AppClient, InfoHeaders } from '@/types/user';

export const useUserInfo = () => {
  const initial = typeof window !== 'undefined' ? window.__INITIAL_DATA__ : undefined;
  
  const { data: response, error, isLoading, isValidating, mutate } = useSWR<{ data: UserInfo; headers: InfoHeaders }>(
    `${getBaseUrl()}${window.location.pathname}/info`,
    fetcher,
    {
      // Don't use fallbackData - we'll handle initial data separately
      // This ensures the fetcher always runs and returns { data, headers } structure
      revalidateIfStale: false,
      revalidateOnMount: true, // Always fetch on mount to get headers
      errorRetryCount: Infinity,
      errorRetryInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
      dedupingInterval: 5000,
      onError: (error) => {
        console.warn('Failed to fetch user info:', error);
      }
    }
  );

  // Extract data and headers from response
  // Response should always be { data, headers } from fetcher for /info endpoint
  const apiData = response?.data;
  const apiHeaders = response?.headers;
  
  // Always prefer initial Jinja-rendered data when available to preserve server-side rendered content
  // Only use API data if we don't have initial data (initial data takes precedence)
  const data = initial?.user || apiData;
  
  // Always use headers from API response (headers are only available from API, not from initial data)
  const headers = apiHeaders;

  const handleRefresh = async () => {
    await mutate();
  };

  // Don't show loading if we have initial data
  const shouldShowLoading = isLoading && !initial?.user;

  return { data, headers, error, isLoading: shouldShowLoading, isValidating, refresh: handleRefresh };
};

export const useConfigData = () => {
  const initialLinksArray = typeof window !== 'undefined'
    ? window.__INITIAL_DATA__?.links
    : undefined;
  
  // If we have initial data, use it directly without making network requests
  if (initialLinksArray && initialLinksArray.length > 0) {
    const data: ConfigData = {
      links: initialLinksArray.filter(link => 
        link && link.length > 0 && (
          link.startsWith('vless://') ||
          link.startsWith('vmess://') ||
          link.startsWith('trojan://') ||
          link.startsWith('ss://')
        )
      )
    };
    return { data };
  }

  // Only make network request if no initial data is available
  const { data: rawData } = useSWR<string>(
    `${getBaseUrl()}${window.location.pathname}/links`,
    textFetcher,
    {
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      onError: (error) => {
        console.warn("Failed to fetch config data:", error);
      },
    }
  );

  // Convert plain text response to ConfigData format
  const data: ConfigData | undefined = rawData
    ? {
        links: rawData
          .split('\n')
          .map(link => link.trim())
          .filter(link => link.length > 0 && (
            link.startsWith('vless://') ||
            link.startsWith('vmess://') ||
            link.startsWith('trojan://') ||
            link.startsWith('ss://')
          ))
      }
    : undefined;

  return { data };
};

export const useChartData = (
  startTime: Date,
  period: string = "hour",
  shouldFetch: boolean = true
) => {
  const { data: chartData, error: chartError } = useSWR<ChartData>(
    shouldFetch ? `${getBaseUrl()}${window.location.pathname}/usage?start=${startTime.toISOString()}&period=${period}` : null,
    fetcher,
    {
      errorRetryCount: 2,
      errorRetryInterval: 2000,
      revalidateOnFocus: false,
      revalidateOnMount: shouldFetch, // Only fetch on first load if shouldFetch is true
      refreshInterval: 60000,
      dedupingInterval: 5000,
      onError: (error) => {
        console.warn("Failed to fetch chart data:", error);
      },
    }
  );

  return { chartData, chartError };
};

export const useApps = () => {
  const initialAppsArray = typeof window !== 'undefined'
    ? window.__INITIAL_DATA__?.apps
    : undefined;
  
  // If we have initial data, use it directly without making network requests
  if (initialAppsArray && initialAppsArray.length > 0) {
    return { apps: initialAppsArray, appsError: null, appsLoading: false };
  }

  // Only make network request if no initial data is available
  const { data, error, isLoading } = useSWRImmutable<AppClient[]>(
    `${getBaseUrl()}${window.location.pathname}/apps`,
    fetcher,
    {
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      onError: (err) => {
        console.warn('Failed to fetch apps:', err)
      }
    }
  )

  return { apps: data, appsError: error, appsLoading: isLoading }
}

// Hook to get support URL from useUserInfo headers (no separate fetch needed)
export const useSupportUrl = () => {
  const { headers } = useUserInfo();
  const supportUrl = headers?.['support-url'];
  
  return { supportUrl: supportUrl || null };
};

