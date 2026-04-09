import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, ScanQrCode, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useDir } from '@/hooks/useDir';
import type { ParsedLink } from '@/lib/linkParser';
import {
  downloadTextFile,
  encodeSubscriptionContentToBase64,
  getWireGuardDownloadPayload,
  prepareSubscriptionContentForCopy,
} from '@/lib/subscriptionConfig';

interface QRModalProps {
  link: ParsedLink;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QRModal = memo(({ link, open, onOpenChange }: QRModalProps) => {
  const { t } = useTranslation();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const dir = useDir();
  const preparedCopyContent = useMemo(() => prepareSubscriptionContentForCopy(link.raw), [link.raw]);
  const wireGuardDownload = useMemo(() => getWireGuardDownloadPayload(link.raw), [link.raw]);
  const isWireGuard = Boolean(wireGuardDownload);
  const supportsBase64Copy = link.protocol !== 'unknown';

  // Check if data is too long for QR code (max ~2950 characters for level L)
  const canGenerateQR = useMemo(() => {
    return link.raw.length <= 2900; // Safe limit for QR level L
  }, [link.raw]);

  // Calculate QR size based on viewport
  const qrSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      const maxSize = 340;
      const minSize = 240;
      const viewportWidth = window.innerWidth;
      // Use 95vw - padding (modal padding + qr container padding)
      const totalPadding = viewportWidth < 640 ? 50 : 70; // Reduced padding
      const mobileSize = Math.min(viewportWidth * 0.95 - totalPadding, maxSize);
      return Math.max(minSize, mobileSize);
    }
    return 280; // Default for SSR
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(preparedCopyContent.content, `${link.raw}:config`);
  }, [copyToClipboard, link.raw, preparedCopyContent.content]);

  const handleCopyBase64 = useCallback(() => {
    const encodedContent = encodeSubscriptionContentToBase64(preparedCopyContent.content);
    copyToClipboard(encodedContent, `${link.raw}:base64`);
  }, [copyToClipboard, link.raw, preparedCopyContent.content]);

  const handleDownloadWireGuard = useCallback(() => {
    if (!wireGuardDownload) {
      return;
    }

    try {
      downloadTextFile(wireGuardDownload.content, wireGuardDownload.fileName);
      toast.success(t('configActions.downloadStarted'));
    } catch (error) {
      console.error('Failed to download WireGuard config:', error);
      toast.error(t('configActions.downloadFailed'));
    }
  }, [t, wireGuardDownload]);

  const copiedConfig = isCopied(`${link.raw}:config`);
  const copiedBase64 = isCopied(`${link.raw}:base64`);
  const protocolBadge =
    link.protocol === 'unknown' ? 'SUB' :
    link.protocol === 'wireguard' ? 'WG' :
    link.protocol === 'hysteria' ? 'HY2' :
    link.protocol;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[460px] max-h-[90dvh] overflow-y-auto overflow-x-hidden p-4 sm:p-6" dir={dir}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <ScanQrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-base">{t('qr.title')}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-3 sm:gap-4 py-1 sm:py-2 overflow-hidden">
          {/* QR Code Display */}
          {canGenerateQR ? (
            <div className="flex justify-center items-center p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm w-full max-w-full">
              <QRCodeCanvas 
                value={link.raw}
                size={qrSize}
                level="L"
                className="w-auto h-auto max-w-full"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-muted/30 rounded-lg sm:rounded-xl w-full">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mb-2 sm:mb-3" />
              <p className="text-sm text-center text-muted-foreground mb-1 sm:mb-2 font-medium">
                {t('qr.tooLong')}
              </p>
              <p className="text-sm text-center text-muted-foreground">
                {t('qr.useCopy')}
              </p>
            </div>
          )}

          {/* Link Info */}
          <div className="w-full p-2.5 sm:p-3 rounded-lg bg-muted/30 flex items-center gap-2 text-sm">
            <div className="page-badge px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary text-primary-foreground">
              {protocolBadge}
            </div>
            {link.emoji && (
              <span className="text-sm sm:text-base">{link.emoji}</span>
            )}
            <span className="page-item-title flex-1 truncate">
              {link.name}
            </span>
          </div>

          <div className={`grid w-full grid-cols-1 gap-2 ${isWireGuard ? 'sm:grid-cols-2' : ''}`}>
            <Button
              onClick={handleCopy}
              size="sm"
              className={`w-full gap-2 h-10 text-sm ${isWireGuard ? '' : 'sm:col-span-1'}`}
            >
              {copiedConfig ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('qr.copied')}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {link.protocol === 'unknown' ? t('qr.copy') : t('configActions.copyConfig')}
                </>
              )}
            </Button>

            {supportsBase64Copy && (
              <Button
                onClick={handleCopyBase64}
                size="sm"
                variant="outline"
                className="w-full gap-2 h-10 text-sm"
              >
                {copiedBase64 ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {t('qr.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {t('configActions.copyBase64')}
                  </>
                )}
              </Button>
            )}

            {wireGuardDownload && (
              <Button
                onClick={handleDownloadWireGuard}
                size="sm"
                variant="outline"
                className="w-full gap-2 h-10 text-sm sm:col-span-2"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t('configActions.downloadWireGuard')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

