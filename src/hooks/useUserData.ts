import useSWR from 'swr';
import { fetcher, textFetcher, getBaseUrl } from '@/lib/fetcher';
import useSWRImmutable from 'swr/immutable'
import type { UserInfo, ConfigData, ChartData, AppClient } from '@/types/user';

export const useUserInfo = () => {
  const initial = typeof window !== 'undefined' ? window.__INITIAL_DATA__ : undefined;
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<UserInfo>(
    `${getBaseUrl()}${window.location.pathname}/info`,
    fetcher,
    {
      fallbackData: initial?.user, // Use initial data as fallback
      revalidateIfStale: false, // Don't revalidate stale data immediately
      revalidateOnMount: false, // Don't fetch on mount if we have initial data
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // 30 seconds interval
      dedupingInterval: 5000,
      onError: (error) => {
        console.warn('Failed to fetch user info:', error);
      }
    }
  );

  const handleRefresh = async () => {
    await mutate();
  };

  // Don't show loading if we have initial data
  const shouldShowLoading = isLoading && !initial?.user;

  return { data, error, isLoading: shouldShowLoading, isValidating, refresh: handleRefresh };
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

