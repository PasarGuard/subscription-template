"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useTranslation } from "react-i18next"
import type { TooltipProps } from "recharts"
import { dateUtils } from "@/lib/dateFormatter"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { Spinner } from "@/components/ui/spinner"

const chartConfig = {
  traffic: {
    label: "Traffic",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface TrafficDataPoint {
  period_start: string
  total_traffic: number
}

interface TrafficChartProps {
  data: TrafficDataPoint[]
  isLoading?: boolean
  error?: Error | null
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
}

interface FormattedDataPoint {
  date: string
  traffic: number
  displayTraffic: number
  _bytes: number
  _period_start: string
}

function CustomTrafficTooltip({ active, payload }: TooltipProps<number, string>) {
  const { t, i18n } = useTranslation()
  
  if (!active || !payload || !payload.length) return null
  
  const data = payload[0].payload as FormattedDataPoint
  
  // Format bytes to human-readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }
  
  // Format date using dateUtils
  const d = dateUtils.toDayjs(data._period_start)
  let formattedDate: string
  
  try {
    if (i18n.language === 'fa') {
      formattedDate = d
        .toDate()
        .toLocaleString('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(',', '')
    } else {
      formattedDate = d.format('YYYY/MM/DD HH:mm')
    }
  } catch {
    formattedDate = d.format('YYYY/MM/DD HH:mm')
  }
  
  const isRTL = i18n.language === 'fa'
  
  return (
    <div 
      className={`min-w-[140px] rounded-lg border border-border bg-background p-3 text-xs shadow-xl ${isRTL ? 'text-right' : 'text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`mb-2 text-xs font-semibold text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
        <span dir="ltr" className="inline-block">
          {formattedDate}
        </span>
      </div>
      <div className={`text-sm font-bold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
        <span>{t('usage.totalUsage')}: </span>
        <span dir="ltr" className="inline-block font-mono">
          {formatBytes(data._bytes)}
        </span>
      </div>
    </div>
  )
}

export function TrafficChart({ 
  data, 
  isLoading = false, 
  error, 
  timeRange = "7d",
  onTimeRangeChange 
}: TrafficChartProps) {
  const { t, i18n } = useTranslation()

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    // Data is already filtered by the API based on timeRange
    // Just format it for the chart
    return data.map((point) => ({
      date: point.period_start,
      traffic: point.total_traffic / (1024 * 1024 * 1024), // Convert to GB
      displayTraffic: parseFloat((point.total_traffic / (1024 * 1024 * 1024)).toFixed(2)),
      _bytes: point.total_traffic,
      _period_start: point.period_start,
    }))
  }, [data])
  const hasChartPoints = filteredData.length > 0

  const timeRangeOptions = [
    { value: '12h', label: t('timeRange.12h') || '12h' },
    { value: '24h', label: t('timeRange.24h') || '24h' },
    { value: '7d', label: t('timeRange.7d') || '7d' },
    { value: '30d', label: t('timeRange.30d') || '30d' },
    { value: '90d', label: t('timeRange.90d') || '90d' },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b pb-4">
        <CardTitle className="text-base sm:text-lg">{t('usage.title')}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange?.(option.value)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                timeRange === option.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 overflow-x-hidden">
        {error ? (
          <div className="h-[250px] w-full flex items-center justify-center text-destructive text-sm">
            {error.message || t('common.error')}
          </div>
        ) : (
          <div className="relative h-[250px] w-full">
            {/* Chart Container - Always rendered to maintain DOM structure */}
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full max-w-full"
            >
              {!hasChartPoints ? (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
                  <div className="w-10 h-10 rounded-full border border-dashed border-muted-foreground/40 flex items-center justify-center">
                    <span className="text-xs">—</span>
                  </div>
                  <span>
                    {t('usage.noDataInRange')}
                  </span>
                </div>
              ) : (
                <AreaChart 
                  data={filteredData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={16}
                    tick={{ 
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 10 
                    }}
                    tickFormatter={(value) => {
                      const d = dateUtils.toDayjs(value)
                      // For 12h and 24h, show time
                      if (timeRange === "12h" || timeRange === "24h") {
                        if (i18n.language === 'fa') {
                          return d.toDate().toLocaleTimeString('fa-IR', {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                          })
                        }
                        return d.format('HH:mm')
                      }
                      // For days, show date
                      if (i18n.language === 'fa') {
                        return d.toDate().toLocaleDateString('fa-IR', {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      return d.format('MMM D')
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<CustomTrafficTooltip />}
                  />
                  <Area
                    dataKey="displayTraffic"
                    type="monotone"
                    fill="url(#fillTraffic)"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              )}
            </ChartContainer>
            
            {/* Loading Overlay - Only shown when loading */}
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <Spinner size="2xl" className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {t('common.loading')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

