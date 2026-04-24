"use client"
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useApps } from '@/hooks/useUserData'
import { cn } from '@/lib/utils'
import { detectOS, getPlatformPriority, mapOSToPlatform } from '@/lib/osDetector'
import { Download, DownloadCloud, Monitor, Tv } from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

type PlatformIconProps = {
    className?: string
}

const LinuxPlatformIcon = ({ className }: PlatformIconProps) => (
    <svg width={28} height={28} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M14.62 8.35c-.42.28-1.75 1.04-1.95 1.19c-.39.31-.75.29-1.14-.01c-.2-.16-1.53-.92-1.95-1.19c-.48-.31-.45-.7.08-.92c1.64-.69 3.28-.64 4.91.03c.49.21.51.6.05.9m7.22 7.28c-.93-2.09-2.2-3.99-3.84-5.66a4.3 4.3 0 0 1-1.06-1.88c-.1-.33-.17-.67-.24-1.01c-.2-.88-.29-1.78-.7-2.61c-.73-1.58-2-2.4-3.84-2.47c-1.81.05-3.16.81-3.95 2.4c-.21.43-.36.88-.46 1.34c-.17.76-.32 1.55-.5 2.32c-.15.65-.45 1.21-.96 1.71c-1.61 1.57-2.9 3.37-3.88 5.35c-.14.29-.28.58-.37.88c-.19.66.29 1.12.99.96c.44-.09.88-.18 1.3-.31c.41-.15.57-.05.67.35c.65 2.15 2.07 3.66 4.24 4.5c4.12 1.56 8.93-.66 9.97-4.58c.07-.27.17-.37.47-.27c.46.14.93.24 1.4.35c.49.09.85-.16.92-.64c.03-.26-.06-.49-.16-.73" />
    </svg>
)

const AndroidPlatformIcon = ({ className }: PlatformIconProps) => (
    <svg width={28} height={28} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M15 9a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1M9 9a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m7.12-4.63l2.1-2.1l-.82-.83l-2.31 2.31C14.16 3.28 13.11 3 12 3c-1.12 0-2.16.28-3.09.75L6.6 1.44l-.82.83l2.1 2.1C6.14 5.64 5 7.68 5 10v1h14v-1c0-2.32-1.14-4.36-2.88-5.63M5 16c0 3.86 3.13 7 7 7a7 7 0 0 0 7-7v-4H5v4z" />
    </svg>
)

const ApplePlatformIcon = ({ className }: PlatformIconProps) => (
    <svg width={28} height={28} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04c-2.04.027-3.91 1.183-4.961 3.014c-2.117 3.675-.546 9.103 1.519 12.09c1.013 1.454 2.208 3.09 3.792 3.039c1.52-.065 2.09-.987 3.935-.987c1.831 0 2.35.987 3.96.948c1.637-.026 2.676-1.48 3.676-2.948c1.156-1.688 1.636-3.325 1.662-3.415c-.039-.013-3.182-1.221-3.22-4.857c-.026-3.04 2.48-4.494 2.597-4.559c-1.429-2.09-3.623-2.324-4.39-2.376c-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83c-1.207.052-2.662.805-3.532 1.818c-.78.896-1.454 2.338-1.273 3.714c1.338.104 2.715-.688 3.559-1.701" />
    </svg>
)

const WindowsPlatformIcon = ({ className }: PlatformIconProps) => (
    <svg width={28} height={28} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M0 0h11.377v11.372H0Zm12.623 0H24v11.372H12.623ZM0 12.623h11.377V24H0Zm12.623 0H24V24H12.623" />
    </svg>
)

const PLATFORM_ICONS: Record<string, React.ComponentType<PlatformIconProps>> = {
    ios: ApplePlatformIcon,
    macos: ApplePlatformIcon,
    appletv: Tv,
    android: AndroidPlatformIcon,
    androidtv: Tv,
    windows: WindowsPlatformIcon,
    linux: LinuxPlatformIcon,
    other: Monitor,
}

export const AppsList = React.memo(function AppsList() {
    const { t, i18n } = useTranslation()
    const { apps, appsError, appsLoading } = useApps()
    const appsList = apps ?? []

    const currentLang = i18n.language?.startsWith('fa')
        ? 'fa'
        : i18n.language?.startsWith('ru')
            ? 'ru'
            : i18n.language?.startsWith('zh')
                ? 'zh'
                : 'en'

    const platformGroups = React.useMemo(() => {
        const groups: Record<string, typeof appsList> = {}
        appsList.forEach((a) => {
            const key = (a.platform || 'other').toLowerCase()
            if (!groups[key]) groups[key] = []
            groups[key]!.push(a)
        })
        return groups
    }, [appsList])

    // Get platform order based on current OS once
    const currentOS = React.useMemo(() => detectOS(), [])
    const platformOrder = React.useMemo(() => getPlatformPriority(currentOS), [currentOS])
    const currentPlatform = React.useMemo(() => mapOSToPlatform(currentOS), [currentOS])
    const orderedPlatformKeys = React.useMemo(
        () => [
            ...platformOrder.filter((platformKey) => platformGroups[platformKey]?.length),
            ...Object.keys(platformGroups)
                .filter((platformKey) => !platformOrder.some((knownPlatform) => knownPlatform === platformKey))
                .sort(),
        ],
        [platformGroups, platformOrder]
    )

    // Get default open accordion (current OS platform)
    const defaultOpenValue = React.useMemo(
        () => (platformGroups[currentPlatform]?.length ? currentPlatform : undefined),
        [platformGroups, currentPlatform]
    )

    if (appsLoading) {
        return (
            <div className="w-full rounded-2xl border bg-card p-4 sm:p-6 text-sm text-muted-foreground">
                {t('common.loading')}
            </div>
        )
    }

    if (appsError) {
        return (
            <div className="w-full rounded-2xl border bg-card p-4 sm:p-6 text-sm text-destructive">
                {t('common.error')}
            </div>
        )
    }

    if (appsList.length === 0) return null

    return (
        <div className="animate-fadeIn">
            <Accordion
                type="single"
                collapsible
                defaultValue={defaultOpenValue}
                className="w-full space-y-3"
            >
                {orderedPlatformKeys
                    .map((platformKey) => {
                        const IconComponent = PLATFORM_ICONS[platformKey] ?? Monitor
                        const isCurrentOS = platformKey === currentPlatform
                        const platformLabel = t(`apps.platform.${platformKey}`, { defaultValue: platformKey })

                        return (
                            <AccordionItem
                                key={platformKey}
                                value={platformKey}
                                className={cn(
                                    "rounded-2xl border bg-card/50 overflow-hidden transition-all duration-300",
                                    "hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5",
                                    "border-border/50",
                                    isCurrentOS && "ring-1 ring-primary/30 bg-card/60"
                                )}
                            >
                                <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline items-center cursor-pointer data-[state=open]:bg-card/40 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 text-left">
                                        <IconComponent className="text-2xl sm:text-3xl text-foreground shrink-0" />
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <h3 className="page-section-title">
                                                {platformLabel}
                                            </h3>
                                            {isCurrentOS && (
                                                <span className="page-badge px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                                                    {t('apps.currentOS')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
                                        {platformGroups[platformKey]!.map((app, idx) => {
                                            const desc = app.description?.[currentLang] || app.description?.en || ''
                                            // Get download links for current language, fallback to 'en', then all available
                                            const dlAll = app.download_links || []
                                            const dlForCurrentLang = dlAll.filter((l) => l.language === currentLang)
                                            const dlForEn = dlAll.filter((l) => l.language === 'en')
                                            const dlToShow = dlForCurrentLang.length > 0 ? dlForCurrentLang : (dlForEn.length > 0 ? dlForEn : dlAll)

                                            return (
                                                <AppCard
                                                    key={`${app.name}-${idx}`}
                                                    app={app}
                                                    desc={desc}
                                                    dlToShow={dlToShow}
                                                    fallbackIcon={IconComponent}
                                                    t={t}
                                                />
                                            )
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
            </Accordion>
        </div>
    )
})

// Minimal App Card Component
const AppCard = React.memo(function AppCard({ app, desc, dlToShow, fallbackIcon: FallbackIcon, t }: {
    app: any;
    desc: string;
    dlToShow: any[];
    fallbackIcon: React.ComponentType<PlatformIconProps>;
    t: any;
}) {
    const [iconLoadFailed, setIconLoadFailed] = React.useState(false)

    React.useEffect(() => {
        setIconLoadFailed(false)
    }, [app.icon_url])

    return (
        <div className={cn(
            "group relative rounded-lg border bg-background p-3 hover:shadow-md hover:shadow-primary/5 transition-all duration-200",
            "flex flex-col gap-2",
            app.recommended && 'ring-1 ring-primary/20'
        )}>
            {/* Header with icon and name */}
            <div className="flex items-center gap-2">
                {app.icon_url && !iconLoadFailed ? (
                    <img
                        src={app.icon_url}
                        alt={app.name}
                        className="w-8 h-8 rounded object-cover shrink-0"
                        onError={() => setIconLoadFailed(true)}
                    />
                ) : (
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                        <FallbackIcon className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h4 className="page-item-title truncate">{app.name}</h4>
                        {app.recommended && (
                            <span className="page-badge px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                                {t('apps.recommended')}
                            </span>
                        )}
                    </div>
                    <div className="page-badge text-muted-foreground">{app.platform}</div>
                </div>
            </div>

            {/* Description - limited to 2 lines */}
            {desc && (
                <div className="page-meta line-clamp-2">
                    {desc}
                </div>
            )}

            {/* Buttons at the end of card */}
            <div className="mt-auto">
                <div className="flex flex-wrap gap-1">
                    {/* Download links for current language */}
                    {dlToShow.map((dl, i) => (
                        <a
                            key={i}
                            href={dl.url}
                            className="text-sm px-2 py-1 rounded border hover:bg-muted inline-flex items-center gap-1 transition-colors"
                            target="_blank"
                            rel="noreferrer"
                            title={dl.name}
                        >
                            <Download className="w-3 h-3" />
                            {dl.name}
                        </a>
                    ))}

                    {/* Import link with primary color */}
                    {app.import_url && (
                        <a
                            href={app.import_url}
                            className="text-sm px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1 transition-opacity"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <DownloadCloud className="w-3 h-3" />
                            {t('apps.import')}
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
})

