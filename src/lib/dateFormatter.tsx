import dayjs from '@/lib/dayjs'
import { useTranslation } from 'react-i18next'

// Helper function to convert timestamp to ISO string
function timestampToISO(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString()
}

// Helper function to convert ISO string to timestamp
function isoToTimestamp(isoString: string): number {
  return Math.floor(new Date(isoString).getTime() / 1000)
}

export const useRelativeExpiryDate = (expiryDate: string | number | null | undefined) => {
  const { t } = useTranslation()
  const dateInfo = { status: '', time: '', isExpired: false }

  if (!expiryDate) return dateInfo

  const target = dateUtils.toDayjs(expiryDate)
  const now = dayjs()

  const isAfter = target.isAfter(now)
  dateInfo.status = isAfter ? t('expires') : t('expired')
  dateInfo.isExpired = !isAfter

  const duration = dayjs.duration(target.diff(now))
  const durationSlots: string[] = []

  if (duration.years()) {
    durationSlots.push(`${Math.abs(duration.years())} ${t(`time.${Math.abs(duration.years()) !== 1 ? 'years' : 'year'}`)}`)
  }

  if (duration.months() && !duration.years()) {
    durationSlots.push(`${Math.abs(duration.months())} ${t(`time.${Math.abs(duration.months()) !== 1 ? 'months' : 'month'}`)}`)
  }

  if (duration.days() && !duration.months() && !duration.years()) {
    durationSlots.push(`${Math.abs(duration.days())} ${t(`time.${Math.abs(duration.days()) !== 1 ? 'days' : 'day'}`)}`)
  }

  if (durationSlots.length === 0) {
    if (duration.hours()) {
      durationSlots.push(`${Math.abs(duration.hours())} ${t(`time.${Math.abs(duration.hours()) !== 1 ? 'hours' : 'hour'}`)}`)
    }

    if (duration.minutes() && !duration.hours()) {
      durationSlots.push(`${Math.abs(duration.minutes())} ${t(`time.${Math.abs(duration.minutes()) !== 1 ? 'mins' : 'min'}`)}`)
    }
  }

  dateInfo.time = durationSlots.join(', ') + (isAfter ? '' : ` ${t('time.ago')}`)
  return dateInfo
}

// Format time ago for online status
export const formatTimeAgo = (
  dateString: string | null | undefined,
  t: (key: string) => string
): { text: string; isOnline: boolean } => {
  if (!dateString) {
    return { text: t('notConnectedYet'), isOnline: false }
  }

  const lastOnlineTime = dateUtils.toDayjs(dateString)
  const now = dayjs()
  const diffInSeconds = Math.abs(now.diff(lastOnlineTime, 'second'))

  const isOnline = diffInSeconds <= 60

  if (isOnline) {
    return { text: t('online'), isOnline: true }
  }

  const duration = dayjs.duration(now.diff(lastOnlineTime))

  let timeText = ''

  const years = Math.abs(duration.years())
  const months = Math.abs(duration.months())
  const days = Math.abs(duration.days())
  const hours = Math.abs(duration.hours())
  const minutes = Math.abs(duration.minutes())
  const seconds = Math.abs(duration.seconds())

  if (years > 0) {
    timeText = `${years} ${t(`time.${years !== 1 ? 'years' : 'year'}`)} ${t('time.ago')}`
  } else if (months > 0) {
    timeText = `${months} ${t(`time.${months !== 1 ? 'months' : 'month'}`)} ${t('time.ago')}`
  } else if (days > 0) {
    timeText = `${days} ${t(`time.${days !== 1 ? 'days' : 'day'}`)} ${t('time.ago')}`
  } else if (hours > 0) {
    timeText = `${hours} ${t(`time.${hours !== 1 ? 'hours' : 'hour'}`)} ${t('time.ago')}`
  } else if (minutes > 0) {
    timeText = `${minutes} ${t(`time.${minutes !== 1 ? 'mins' : 'min'}`)} ${t('time.ago')}`
  } else {
    timeText = `${seconds} ${t(`time.${seconds !== 1 ? 'seconds' : 'second'}`)} ${t('time.ago')}`
  }

  return { text: timeText, isOnline: false }
}

// Format relative expiry for standalone use
export const formatRelativeExpiry = (
  expiryDate: string | number | null | undefined,
  t: (key: string) => string
): { status: string; time: string; isExpired: boolean } => {
  if (!expiryDate || expiryDate === 0) {
    return { status: '∞', time: t('userInfo.unlimited'), isExpired: false }
  }

  const target = dateUtils.toDayjs(expiryDate)
  const now = dayjs()

  const isAfter = target.isAfter(now)
  const status = isAfter ? t('expires') : t('expired')

  const duration = dayjs.duration(target.diff(now))
  const durationSlots: string[] = []

  const years = Math.abs(duration.years())
  const months = Math.abs(duration.months())
  const days = Math.abs(duration.days())
  const hours = Math.abs(duration.hours())
  const minutes = Math.abs(duration.minutes())

  if (years > 0) {
    durationSlots.push(`${years} ${t(`time.${years !== 1 ? 'years' : 'year'}`)}`)
  }

  if (months > 0 && years === 0) {
    durationSlots.push(`${months} ${t(`time.${months !== 1 ? 'months' : 'month'}`)}`)
  }

  if (days > 0 && months === 0 && years === 0) {
    durationSlots.push(`${days} ${t(`time.${days !== 1 ? 'days' : 'day'}`)}`)
  }

  if (durationSlots.length === 0) {
    if (hours > 0) {
      durationSlots.push(`${hours} ${t(`time.${hours !== 1 ? 'hours' : 'hour'}`)}`)
    }

    if (minutes > 0 && hours === 0) {
      durationSlots.push(`${minutes} ${t(`time.${minutes !== 1 ? 'mins' : 'min'}`)}`)
    }
  }

  const time = durationSlots.join(', ') + (isAfter ? '' : ` ${t('time.ago')}`)
  
  return { status, time, isExpired: !isAfter }
}

// Format date for display
export const formatDate = (
  dateString: string | null | undefined,
  locale?: string
): string => {
  if (!dateString) return ''
  
  const d = dateUtils.toDayjs(dateString)
  
  if (locale === 'fa-IR') {
    return d.toDate().toLocaleDateString(locale, { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return d.format('MMM D, YYYY HH:mm')
}

// Export helper functions for use in other components
export const dateUtils = {
  timestampToISO,
  isoToTimestamp,

  getCurrentISOTime: () => {
    return dayjs().toISOString() // ISO in UTC (standard)
  },

  formatDate: (date: string | number | Date) => {
    const d = typeof date === 'string' ? dayjs.utc(date).local() : typeof date === 'number' ? dayjs.unix(date).local() : dayjs(date).local()

    return d.format('YYYY-MM-DD HH:mm:ss')
  },

  toDayjs: (date: string | number | Date) => {
    return typeof date === 'string' ? dayjs.utc(date).local() : typeof date === 'number' ? dayjs.unix(date).local() : dayjs(date).local()
  },

  isValidDate: (date: string | number | Date) => {
    const d = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date * 1000) : date

    return !isNaN(d.getTime())
  },

  daysToSeconds: (days: number | undefined): number | undefined => {
    if (days === undefined || days === null || days === 0) return undefined
    return Math.round(Number(days) * 24 * 60 * 60)
  },

  secondsToDays: (seconds: number | undefined): number | undefined => {
    if (seconds === undefined || seconds === null || seconds === 0) return undefined
    return Math.round(Number(seconds) / (24 * 60 * 60))
  },
}
