"use client"
import { useTranslation } from 'react-i18next'
import { useApps } from '@/hooks/useUserData'
import { cn } from '@/lib/utils'
import { detectOS, getPlatformPriority, mapOSToPlatform } from '@/lib/osDetector'
import { Download, DownloadCloud } from 'lucide-react'
import { 
  FaApple, 
  FaAndroid, 
  FaWindows, 
  FaLinux, 
  FaDesktop 
} from 'react-icons/fa'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AppsList() {
    const { t, i18n } = useTranslation()
    const { apps, appsError, appsLoading } = useApps()

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

    if (!apps || apps.length === 0) return null

    const currentLang = i18n.language?.startsWith('fa')
        ? 'fa'
        : i18n.language?.startsWith('ru')
            ? 'ru'
            : i18n.language?.startsWith('zh')
                ? 'zh'
                : 'en'

    // Group by platform
    const platformGroups: Record<string, typeof apps> = {}
    apps.forEach((a) => {
        const key = (a.platform || 'other').toLowerCase()
        if (!platformGroups[key]) platformGroups[key] = []
        platformGroups[key]!.push(a)
    })

    // Get platform order based on current OS
    const currentOS = detectOS()
    const platformOrder = getPlatformPriority(currentOS)
    const currentPlatform = mapOSToPlatform(currentOS)
    
    // Platform icons mapping
    const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
        ios: FaApple,
        android: FaAndroid,
        windows: FaWindows,
        linux: FaLinux,
        other: FaDesktop
    }

    // Get default open accordion (current OS platform)
    const defaultOpenValue = platformGroups[currentPlatform]?.length ? currentPlatform : undefined

    return (
        <div className="animate-fadeIn">
            <Accordion
                type="single"
                collapsible
                defaultValue={defaultOpenValue}
                className="w-full space-y-3"
            >
                {platformOrder
                    .filter((p) => platformGroups[p]?.length)
                    .map((platformKey) => {
                        const IconComponent = platformIcons[platformKey] || FaDesktop
                        const isCurrentOS = platformKey === currentPlatform
                        
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
                                <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-5 hover:no-underline [&[data-state=open]]:bg-card/40 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 text-left">
                                        <IconComponent className="text-2xl sm:text-3xl text-foreground flex-shrink-0" />
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-bold text-foreground">
                                                {t(`apps.platform.${platformKey}`)}
                                            </h3>
                                            {isCurrentOS && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium flex-shrink-0">
                                                    {t('apps.currentOS')}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground ml-auto flex-shrink-0 font-medium">
                                                ({platformGroups[platformKey]!.length})
                                            </span>
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
}

// Minimal App Card Component
function AppCard({ app, desc, dlToShow, t }: {
    app: any;
    desc: string;
    dlToShow: any[];
    t: any;
}) {
    return (
        <div className={cn(
            "group relative rounded-lg border bg-background p-3 hover:shadow-md hover:shadow-primary/5 transition-all duration-200",
            "flex flex-col gap-2",
            app.recommended && 'ring-1 ring-primary/20'
        )}>
            {/* Header with icon and name */}
            <div className="flex items-center gap-2">
                {app.icon_url ? (
                    <img src={app.icon_url} alt={app.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                ) : (
                    <div className="w-8 h-8 rounded bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h4 className="font-medium text-sm truncate">{app.name}</h4>
                        {app.recommended && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                                {t('apps.recommended')}
                            </span>
                        )}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">{app.platform}</div>
                </div>
            </div>

            {/* Description - limited to 2 lines */}
            {desc && (
                <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
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
                            className="text-xs px-2 py-1 rounded border hover:bg-muted inline-flex items-center gap-1 transition-colors" 
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
                            className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-1 transition-opacity" 
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
}


