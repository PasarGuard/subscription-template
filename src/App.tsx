import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserInfo, useConfigData, useChartData } from '@/hooks/useUserData';
import { useLanguage } from '@/hooks/useLanguage';
import { Layout } from '@/components/layout';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { OnlineBadge } from '@/components/online-badge';
import { TrafficChart } from '@/components/traffic-chart';
import { ConnectionLinks } from '@/components/connection-links';
import { ProminentSubscriptionLink } from '@/components/prominent-subscription-link';
import { AppsList } from '@/components/AppsList';
import { formatRelativeExpiry, formatDate } from '@/lib/dateFormatter';
import { RefreshCcw, Bell } from 'lucide-react';
import { useDir } from '@/hooks/useDir';
import { cn } from './lib/utils';

function App() {
  const { t, i18n } = useTranslation();
  useLanguage();
  const [timeRange, setTimeRange] = useState('7d');
  
  
  
  const { startTime, period } = useMemo(() => {
    const now = new Date();
    const start = new Date();
    let selectedPeriod = 'hour';
    
    switch (timeRange) {
      case "12h":
        start.setTime(now.getTime() - 12 * 60 * 60 * 1000);
        selectedPeriod = 'hour';
        break;
      case "24h":
        start.setTime(now.getTime() - 24 * 60 * 60 * 1000);
        selectedPeriod = 'hour';
        break;
      case "7d":
        start.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        selectedPeriod = 'day';
        break;
      case "30d":
        start.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        selectedPeriod = 'day';
        break;
      case "90d":
        start.setTime(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        selectedPeriod = 'day';
        break;
      default:
        start.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        selectedPeriod = 'day';
    }
    
    return { startTime: start, period: selectedPeriod };
  }, [timeRange]);

  const { data, headers, error, isLoading, isValidating, refresh } = useUserInfo();
  const { data: configData } = useConfigData();
  
  // Check if we have initial/fallback data to use even if there's an error
  const hasInitialData = typeof window !== 'undefined' && window.__INITIAL_DATA__?.user;
  const hasData = data || hasInitialData;
  const effectiveData = data || (hasInitialData ? window.__INITIAL_DATA__?.user : undefined);
  
  // Get raw announce header value
  const rawAnnounceHeader = useMemo(() => {
    if (!headers) return null;
    return (headers as any)['announce'] || (headers as any)['Announce'] || (headers as any)['ANNOUNCE'] || null;
  }, [headers]);

  // Decode announcement message (can be URL-encoded or base64)
  const announcementMessage = useMemo(() => {
    if (!rawAnnounceHeader || typeof rawAnnounceHeader !== 'string') return null;
    
    const announce = rawAnnounceHeader;
    console.log(headers);
    
    
    // Check if it's base64 encoded (format: "base64:...")
    if (announce.startsWith('base64:')) {
      try {
        const base64Data = announce.substring(7).trim(); // Remove "base64:" prefix and trim whitespace
        if (!base64Data) return null;
        
        // Decode base64
        const decoded = decodeURIComponent(escape(atob(base64Data)));
        return decoded;
      } catch (error) {
        console.warn('Failed to decode base64 announcement:', error, 'Raw value:', announce);
        // If decoding fails, return the original value without the prefix
        return announce.substring(7);
      }
    }
    
    // Otherwise, try URL decoding
    try {
      return decodeURIComponent(announce);
    } catch {
      return announce;
    }
  }, [rawAnnounceHeader]);
  
  // Fetch chart data independently - don't wait for user info
  const { chartData, chartError } = useChartData(startTime, period, true);
  const dir = useDir();


  // Calculate usage percentage
  const usagePercentage = useMemo(() => {
    if (!effectiveData || !effectiveData.data_limit || effectiveData.data_limit === 0 || !effectiveData.used_traffic) return 0;
    const percentage = (effectiveData.used_traffic / effectiveData.data_limit) * 100;
    return Math.min(isNaN(percentage) ? 0 : percentage, 100);
  }, [effectiveData]);

  // Calculate expiry information
  const expiryInfo = useMemo(() => {
    if (!effectiveData) return { status: '', time: '', isExpired: false };
    
    // For on_hold status, show available duration instead of expiry
    if (effectiveData.status === 'on_hold' && effectiveData.on_hold_expire_duration) {
      const days = Math.floor(effectiveData.on_hold_expire_duration / 86400); // Convert seconds to days
      const hours = Math.floor((effectiveData.on_hold_expire_duration % 86400) / 3600);
      
      let timeText = '';
      if (days > 0) {
        timeText = `${days} ${t(days === 1 ? 'time.day' : 'time.days')}`;
        if (hours > 0 && days < 30) {
          timeText += ` ${hours} ${t(hours === 1 ? 'time.hour' : 'time.hours')}`;
        }
      } else if (hours > 0) {
        timeText = `${hours} ${t(hours === 1 ? 'time.hour' : 'time.hours')}`;
      }
      
      return {
        status: t('userInfo.available'),
        time: timeText,
        isExpired: false
      };
    }
    
    return formatRelativeExpiry(effectiveData.expire, t);
  }, [effectiveData, t]);

  // Status color mapping
  const statusConfig = {
    active: { color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20', glow: 'shadow-green-500/50' },
    disabled: { color: 'text-gray-500', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/20', glow: 'shadow-gray-500/50' },
    limited: { color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', glow: 'shadow-red-500/50' },
    expired: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20', glow: 'shadow-yellow-500/50' },
    on_hold: { color: 'text-violet-500', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20', glow: 'shadow-violet-500/50' },
  };


  // Format bytes to human-readable
  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    if (i < 0 || i >= sizes.length) return '0 B';
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(2)} ${sizes[i]}`;
  };

  // Show loading only if we have no data at all (not even initial data) and are still loading
  if (isLoading && !hasData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Only show error page if we have no data at all (not even initial/fallback) and we're not loading/retrying
  // If we have data (even from initial/fallback), continue showing it and retry in background
  if (error && !hasData && !isLoading && !isValidating) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 animate-fadeIn p-8 rounded-3xl bg-card border shadow-lg max-w-md">
            <div className="text-6xl">⚠️</div>
            <p className="text-2xl font-bold text-destructive">{t('dashboard.error')}</p>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!effectiveData) return null;

  // Normalize status to lowercase and ensure it's valid
  const normalizedStatus = useMemo(() => {
    if (!effectiveData?.status) return 'active';
    const status = String(effectiveData.status).toLowerCase();
    // Map valid status values
    const validStatuses = ['active', 'disabled', 'limited', 'expired', 'on_hold'];
    return validStatuses.includes(status) ? status : 'active';
  }, [effectiveData?.status]);

  const statusStyle = statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.disabled;

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Hero Section */}
        <div className="relative">
          <div className="container relative px-4 pt-12 mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-8 sm:mb-12 animate-fadeIn">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-foreground">
                  {t('dashboard.title')}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p dir="ltr" className="text-sm sm:text-base text-muted-foreground font-medium">@{effectiveData.username}</p>
                  <OnlineBadge lastOnline={effectiveData.online_at} showText />
                  {/* Refresh Indicator */}
                  <button
                    onClick={() => {
                      if (!isValidating && normalizedStatus !== 'disabled') {
                        refresh();
                      }
                    }}
                    disabled={isValidating || normalizedStatus === 'disabled'}
                    className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
                    title={normalizedStatus === 'disabled' ? 'Account disabled' : 'Refresh data'}
                    aria-label={normalizedStatus === 'disabled' ? 'Account disabled' : 'Refresh data'}
                  >
                    <RefreshCcw 
                      className={`w-4 h-4 transition-all duration-500 ${isValidating ? 'animate-spin text-primary' : normalizedStatus === 'disabled' ? 'text-muted-foreground/50' : 'text-muted-foreground hover:text-primary'}`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        
            {/* Announcements */}
            {(rawAnnounceHeader || announcementMessage || headers?.['announce-url']) && (
              <div className="mb-6 sm:mb-8 animate-fadeIn">
                <div className="p-4 rounded-2xl border bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground mb-1">
                        {t('userInfo.announcement')}
                      </div>
                      {announcementMessage && (
                        <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap break-words">
                          {announcementMessage}
                        </p>
                      )}
                      {headers?.['announce-url'] && (
                        <a
                          href={headers['announce-url']}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                        >
                          {t('userInfo.viewAnnouncement')}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        
            {/* Status Hero Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Main Status Card */}
              <div className={`lg:col-span-2 relative p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border ${statusStyle.borderColor} bg-card shadow-lg animate-fadeIn hover:shadow-xl transition-all duration-300`}>
                <div className={`absolute inset-0 ${statusStyle.bgColor} rounded-2xl sm:rounded-3xl -z-10`}></div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${statusStyle.color}`}>
                        {t(`status.${normalizedStatus}`).toUpperCase()}
                      </span>
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${statusStyle.color.replace('text-', 'bg-')} animate-pulse`}></div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('userInfo.accountStatus')}</p>
                  </div>
                  <div className="">
                    <div className={`text-xs sm:text-sm font-medium ${expiryInfo.isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {expiryInfo.status}
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{expiryInfo.time}</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 flex-shrink-0">
                    <svg className="transform -rotate-90 w-full h-full">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted/20"
                      />
                      {usagePercentage > 0 && usagePercentage < 100 && (
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - usagePercentage / 100)}`}
                          className={cn(
                            statusStyle.color,
                            "transition-all duration-1000 ease-out"
                          )}
                          strokeLinecap="round"
                        />
                      )}
                      {usagePercentage >= 100 && (
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className={cn(
                            statusStyle.color,
                            "transition-all duration-1000 ease-out"
                          )}
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold">{Math.min(usagePercentage, 100).toFixed(0)}%</span>
                      <span className="text-xs text-muted-foreground">{t('userInfo.used')}</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-4 sm:space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-muted-foreground">{t('userInfo.usedTraffic')}</span>
                      <span dir="ltr" className="text-base sm:text-lg font-bold">
                        {formatBytes(effectiveData.used_traffic || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-muted-foreground">{t('userInfo.totalLimit')}</span>
                      <span dir="ltr" className="text-base sm:text-lg font-bold">
                        {effectiveData.data_limit && effectiveData.data_limit > 0 ? formatBytes(effectiveData.data_limit) : t('userInfo.unlimited')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-muted-foreground">{t('remaining')}</span>
                      <span dir="ltr" className="text-base sm:text-lg font-bold text-green-600 dark:text-green-500">
                        {!effectiveData.data_limit || effectiveData.data_limit === 0
                          ? '∞'
                          : effectiveData.used_traffic !== null && effectiveData.used_traffic !== undefined
                          ? formatBytes(Math.max(0, effectiveData.data_limit - effectiveData.used_traffic))
                          : formatBytes(effectiveData.data_limit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="relative p-4 sm:p-6 rounded-2xl border bg-card overflow-hidden animate-fadeIn hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">{t('userInfo.lifetimeTraffic')}</div>
                    <div dir="ltr" className="text-2xl sm:text-3xl font-bold text-foreground">
                      {formatBytes(effectiveData.lifetime_used_traffic || 0)}
                    </div>
                  </div>
                </div>

                <div className="relative p-4 sm:p-6 rounded-2xl border bg-card overflow-hidden animate-fadeIn hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">
                      {effectiveData.status === 'on_hold' ? t('userInfo.duration') : t('userInfo.expiryDate')}
                    </div>
                    {(() => {
                      // For on_hold status, show available duration
                      if (effectiveData.status === 'on_hold') {
                        if (!effectiveData.on_hold_expire_duration || effectiveData.on_hold_expire_duration === 0) {
                          return (
                            <div dir="ltr" className="text-base sm:text-lg font-bold text-foreground">
                              ∞
                            </div>
                          );
                        }
                        
                        const days = Math.floor(effectiveData.on_hold_expire_duration / 86400);
                        const hours = Math.floor((effectiveData.on_hold_expire_duration % 86400) / 3600);

                        return (
                          <div
                            dir={dir === "rtl" ? "rtl" : "ltr"}
                            className={cn("text-base sm:text-lg font-bold text-foreground")}
                          >
                            {days > 0
                              ? `${days} ${t(days === 1 ? 'time.day' : 'time.days')}`
                              : hours > 0
                              ? `${hours} ${t(hours === 1 ? 'time.hour' : 'time.hours')}`
                              : '∞'}
                          </div>
                        );
                      }
                      // For other statuses
                      const isUnlimited = !effectiveData.expire || effectiveData.expire === '0' || effectiveData.expire === '';
                      return (
                        <div dir='ltr' className="text-base sm:text-lg font-bold text-foreground">
                          {isUnlimited
                            ? '∞'
                            : formatDate(effectiveData.expire, i18n.language === 'fa' ? 'fa-IR' : i18n.language)}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="relative p-4 sm:p-6 rounded-2xl border bg-card overflow-hidden animate-fadeIn hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">{t('userInfo.lastOnline')}</div>
                    <div dir="ltr" className="flex flex-wrap items-center gap-2">
                      <OnlineBadge lastOnline={effectiveData.online_at} />
                      <div className="text-xs sm:text-sm font-medium text-foreground break-all">
                        {effectiveData.online_at ? formatDate(effectiveData.online_at, i18n.language === 'fa' ? 'fa-IR' : i18n.language) : t('notConnectedYet')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container relative px-4 py-6 sm:py-12 mx-auto max-w-7xl overflow-x-hidden">

          {/* Conditional rendering based on available data */}
          {(() => {
            const hasLinks = configData?.links && configData.links.length > 0;
            const hasChartContainer = !chartError; // Always show chart container if no error (even during loading)

            if (!hasLinks && !hasChartContainer) {
              return null;
            }

            const statsKey = chartData ? Object.keys(chartData.stats)[0] : undefined;
            const usageData = statsKey && chartData ? (chartData.stats as any)[statsKey] ?? [] : [];
            const isChartLoading = !chartError && !chartData;

            return (
              <div className={`grid grid-cols-1 gap-6 sm:gap-8 w-full ${hasLinks && hasChartContainer ? 'lg:grid-cols-2' : ''}`}>
                {/* Connection Links - Order 2 on mobile, 1 on desktop */}
                {hasLinks ? (
                  <div className={hasChartContainer ? 'order-2 lg:order-1' : ''}>
                    <ConnectionLinks links={configData.links} />
                  </div>
                ) : (
                  <ProminentSubscriptionLink hasChart={hasChartContainer} />
                )}

                {/* Usage Chart - Order 1 on mobile, 2 on desktop */}
                {hasChartContainer && (
                  <div className={cn("space-y-4 animate-fadeIn w-full min-w-0", hasLinks && 'order-1 lg:order-2')}>
                    <TrafficChart 
                      data={usageData}
                      isLoading={isChartLoading}
                      error={chartError}
                      timeRange={timeRange}
                      onTimeRangeChange={setTimeRange}
                    />
                  </div>
                )}
              </div>
            );
          })()}

          {/* Separator */}
          <div className="my-8 sm:my-12">
            <div className="flex items-center gap-4 animate-fadeIn">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-xs font-medium text-primary border border-primary/20 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                <span className="text-sm mr-2 animate-bounce">📱</span>
                {t('apps.title')}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
          </div>

          {/* Apps section under chart and configs */}
          <div className="mt-6 sm:mt-8">
            <AppsList />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
