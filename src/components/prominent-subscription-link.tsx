import { useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ScanQrCode } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { QRModal } from '@/components/qr-modal';
import { cn } from '@/lib/utils';
import type { ParsedLink } from '@/lib/linkParser';

interface ProminentSubscriptionLinkProps {
  hasChart?: boolean;
}

export const ProminentSubscriptionLink = memo(({ hasChart }: ProminentSubscriptionLinkProps) => {
  const { t } = useTranslation();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  
  const subscriptionUrl = useMemo(() => 
    `${window.location.origin}${window.location.pathname.replace(/\/info$/, '')}`, 
    []
  );

  const handleCopy = useCallback(() => {
    copyToClipboard(subscriptionUrl, subscriptionUrl);
  }, [copyToClipboard, subscriptionUrl]);

  const handleShowQR = useCallback(() => {
    setQrModalOpen(true);
  }, []);

  const subscriptionLinkData = useMemo<ParsedLink>(() => ({
    protocol: 'unknown',
    name: t('config.subscriptionLink'),
    emoji: '📱',
    raw: subscriptionUrl
  }), [subscriptionUrl, t]);

  return (
    <div className={cn(
      "animate-fadeIn",
      hasChart ? 'order-2 lg:order-1' : ''
    )}>
      <div className="space-y-3 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <span className="text-xl">🔗</span>
            {t('config.title')}
          </h2>
        </div>
        
        <div className="group relative p-3 rounded-lg border-2 border-primary/30 bg-primary/5 hover:border-primary/60 transition-all duration-200">
          <div className="flex items-center gap-2">
            {/* Subscription Badge */}
            <div className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase flex-shrink-0">
              SUB
            </div>
            
            {/* Emoji */}
            <span className="text-sm">📱</span>
            
            {/* Name */}
            <div className="flex-1 min-w-0 text-xs font-medium text-foreground truncate">
              {t('config.subscriptionLink')}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  isCopied(subscriptionUrl)
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
                onClick={handleShowQR}
                className="p-1.5 rounded bg-muted hover:bg-secondary transition-all cursor-pointer"
                title={t('qr.show')}
              >
                <ScanQrCode className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {qrModalOpen && (
        <QRModal
          link={subscriptionLinkData}
          open={qrModalOpen}
          onOpenChange={setQrModalOpen}
        />
      )}
    </div>
  );
});

ProminentSubscriptionLink.displayName = 'ProminentSubscriptionLink';

