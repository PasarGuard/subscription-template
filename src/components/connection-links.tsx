import { useState, memo, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ScanQrCode, Files, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { parseLinks, type ParsedLink } from '@/lib/linkParser';
import {
  downloadTextFile,
  getWireGuardDownloadPayload,
  prepareSubscriptionContentForCopy,
} from '@/lib/subscriptionConfig';
import { QRModal } from '@/components/qr-modal';

interface ConnectionLinksProps {
  links: string[];
}

export const ConnectionLinks = memo(({ links }: ConnectionLinksProps) => {
  const { t } = useTranslation();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [selectedLink, setSelectedLink] = useState<ParsedLink | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);
  const copyAllTimeoutRef = useRef<number | null>(null);

  // Memoize parsed links to avoid re-parsing on every render
  const parsedLinks = useMemo(() => parseLinks(links), [links]);

  // Memoize subscription URL to avoid recalculating on every render
  const subscriptionUrl = useMemo(() =>
    `${window.location.origin}${window.location.pathname.replace(/\/info$/, '')}`,
    []
  );

  // Memoize all configs text to avoid recalculating on every render
  const allConfigsText = useMemo(() => {
    const allConfigs = parsedLinks.map(link => link.raw);
    return allConfigs.join('\n');
  }, [parsedLinks]);

  const handleCopy = useCallback((link: ParsedLink) => {
    const prepared = prepareSubscriptionContentForCopy(link.raw);
    copyToClipboard(prepared.content, `${link.raw}:config`);
  }, [copyToClipboard]);

  const handleCopySubscription = useCallback(() => {
    copyToClipboard(subscriptionUrl, subscriptionUrl);
  }, [copyToClipboard, subscriptionUrl]);

  const handleShowQR = useCallback((link: ParsedLink) => {
    setSelectedLink(link);
    setQrModalOpen(true);
  }, []);

  const handleCopyAll = useCallback(() => {
    // Clear any existing timeout
    if (copyAllTimeoutRef.current) {
      clearTimeout(copyAllTimeoutRef.current);
    }

    const prepared = prepareSubscriptionContentForCopy(allConfigsText);
    copyToClipboard(prepared.content, allConfigsText);
    setCopyAllSuccess(true);

    // Debounce the success state reset
    copyAllTimeoutRef.current = setTimeout(() => {
      setCopyAllSuccess(false);
    }, 2000);
  }, [copyToClipboard, allConfigsText]);

  const handleDownloadWireGuard = useCallback((link: ParsedLink) => {
    try {
      const payload = getWireGuardDownloadPayload(link.raw);
      if (!payload) {
        throw new Error('WireGuard config not available');
      }

      downloadTextFile(payload.content, payload.fileName);
      toast.success(t('configActions.downloadStarted'));
    } catch (error) {
      console.error('Failed to download WireGuard config:', error);
      toast.error(t('configActions.downloadFailed'));
    }
  }, [t]);

  const getProtocolBadge = useCallback((protocol: ParsedLink['protocol']) => {
    if (protocol === 'unknown') return 'SUB';
    if (protocol === 'shadowsocks') return 'SS';
    if (protocol === 'wireguard') return 'WG';
    if (protocol === 'hysteria') return 'HY2';
    return protocol;
  }, []);

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="page-section-title flex items-center gap-2">
          <span className="text-xl">🔗</span>
          {t('config.title')}
        </h2>
        <button
          onClick={handleCopyAll}
          className={`group cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg ${copyAllSuccess
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/25'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25'
            }`}
          title={copyAllSuccess ? t('apps.copyAllSuccess') : t('apps.copyAll')}
        >
          {copyAllSuccess ? (
            <Check className="w-4 h-4 transition-transform duration-200 animate-pulse" />
          ) : (
            <Files className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
          )}
          <span className="transition-all duration-200 group-hover:translate-x-0.5">
            {copyAllSuccess ? t('apps.copyAllSuccess') : t('apps.copyAll')}
          </span>
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {/* Subscription Link */}
        <div className="group relative p-3 rounded-lg border-2 border-primary/30 bg-primary/5 hover:border-primary/60 transition-all duration-200">
          <div className="flex items-center gap-2">
            {/* Subscription Badge */}
            <div className="page-badge px-2 py-0.5 rounded bg-primary text-primary-foreground shrink-0">
              SUB
            </div>

            {/* Emoji */}
            <span className="text-sm">📱</span>

            {/* Name */}
            <div className="page-item-title flex-1 min-w-0 truncate">
              {t('config.subscriptionLink')}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={handleCopySubscription}
                className={`p-1.5 rounded transition-all cursor-pointer ${isCopied(subscriptionUrl)
                    ? 'bg-green-600 text-white'
                    : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                  }`}
                title={t('qr.copy')}
              >
                {isCopied(subscriptionUrl) ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => handleShowQR({
                  protocol: 'unknown',
                  name: t('config.subscriptionLink'),
                  emoji: '📱',
                  raw: subscriptionUrl
                })}
                className="p-1.5 rounded bg-muted hover:bg-secondary transition-all cursor-pointer"
                title={t('qr.show')}
              >
                <ScanQrCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-2 xl:max-h-[400px] xl:overflow-y-auto xl:min-h-0">
          {parsedLinks.map((link, index) => {
            const copied = isCopied(`${link.raw}:config`);

            return (
              <div
                key={index}
                className="group relative p-3 rounded-lg border bg-card hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  {/* Protocol Badge */}
                  <div className="page-badge px-2 py-0.5 rounded bg-primary text-primary-foreground shrink-0">
                    {getProtocolBadge(link.protocol)}
                  </div>

                  {/* Emoji */}
                  {link.emoji && (
                    <span className="text-sm">{link.emoji}</span>
                  )}

                  {/* Name */}
                  <div className="page-item-title flex-1 min-w-0 truncate">
                    {link.name}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 shrink-0">
                    {getWireGuardDownloadPayload(link.raw) && (
                      <button
                        onClick={() => handleDownloadWireGuard(link)}
                        className="p-1.5 rounded bg-muted hover:bg-secondary transition-all cursor-pointer"
                        title={t('configActions.downloadWireGuard')}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(link)}
                      className={`p-1.5 rounded transition-all cursor-pointer ${copied
                          ? 'bg-green-600 text-white'
                          : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                        }`}
                      title={link.protocol === 'unknown' ? t('qr.copy') : t('configActions.copyConfig')}
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleShowQR(link)}
                      className="p-1.5 rounded bg-muted hover:bg-secondary transition-all cursor-pointer"
                      title={t('qr.show')}
                    >
                      <ScanQrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Keep the dialog mounted after close so Radix can play exit animations */}
      {selectedLink && (
        <QRModal
          link={selectedLink}
          open={qrModalOpen}
          onOpenChange={setQrModalOpen}
        />
      )}
    </div>
  );
});

