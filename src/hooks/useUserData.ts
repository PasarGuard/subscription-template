import useSWR from 'swr';
import { fetcher, textFetcher, getBaseUrl } from '@/lib/fetcher';
import type { UserInfo, ConfigData, ChartData } from '@/types/user';

export const useUserInfo = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<UserInfo>(
    `${getBaseUrl()}${window.location.pathname}/info`,
    fetcher,
    {
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000, // Refresh every 10 seconds for real-time updates
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      onError: (error) => {
        console.warn('Failed to fetch user info:', error);
      }
    }
  );

  const handleRefresh = async () => {
    await mutate();
  };

  return { data, error, isLoading, isValidating, refresh: handleRefresh };
};

export const useConfigData = () => {
  const { data: rawData } = useSWR<string>(
    `${getBaseUrl()}${window.location.pathname}/links`,
    textFetcher,
    {
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Cache config data for 30 seconds
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
  period: string = "hour"
) => {
  const { data: chartData, error: chartError } = useSWR<ChartData>(
    `${getBaseUrl()}${window.location.pathname}/usage?start=${startTime.toISOString()}&period=${period}`,
    fetcher,
    {
      errorRetryCount: 2,
      errorRetryInterval: 2000,
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh chart data every minute
      dedupingInterval: 5000,
      onError: (error) => {
        console.warn("Failed to fetch chart data:", error);
      },
    }
  );

  return { chartData, chartError };
};

