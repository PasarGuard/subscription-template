import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, ScanQrCode, AlertCircle } from 'lucide-react';
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

interface QRModalProps {
  link: ParsedLink;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QRModal = memo(({ link, open, onOpenChange }: QRModalProps) => {
  const { t } = useTranslation();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const dir = useDir();

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

  const handleCopy = () => {
    copyToClipboard(link.raw, link.raw);
  };

  const copied = isCopied(link.raw);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[460px] max-h-[90dvh] overflow-y-auto overflow-x-hidden p-4 sm:p-6" dir={dir}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <ScanQrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{t('qr.title')}</span>
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
              <p className="text-xs sm:text-sm text-center text-muted-foreground mb-1 sm:mb-2 font-medium">
                {t('qr.tooLong')}
              </p>
              <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                {t('qr.useCopy')}
              </p>
            </div>
          )}

          {/* Link Info */}
          <div className="w-full p-2.5 sm:p-3 rounded-lg bg-muted/30 flex items-center gap-2 text-xs">
            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold uppercase">
              {link.protocol === 'unknown' ? 'SUB' : link.protocol}
            </div>
            {link.emoji && (
              <span className="text-sm sm:text-base">{link.emoji}</span>
            )}
            <span className="font-medium text-foreground flex-1 truncate text-[11px] sm:text-xs">
              {link.name}
            </span>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleCopy}
            size="sm"
            className="w-full gap-2 h-9 sm:h-10 text-xs sm:text-sm"
            variant={copied ? 'default' : 'default'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t('qr.copied')}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t('qr.copy')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

