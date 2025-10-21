import { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ScanQrCode, Files } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { parseLinks, type ParsedLink } from '@/lib/linkParser';
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

  const parsedLinks = parseLinks(links);

  // Generate subscription link by removing /info from current path
  const subscriptionUrl = `${window.location.origin}${window.location.pathname.replace(/\/info$/, '')}`;

  const handleCopy = (link: ParsedLink) => {
    copyToClipboard(link.raw, link.raw);
  };

  const handleCopySubscription = () => {
    copyToClipboard(subscriptionUrl, subscriptionUrl);
  };

  const handleShowQR = (link: ParsedLink) => {
    setSelectedLink(link);
    setQrModalOpen(true);
  };

  const handleCopyAll = () => {
    const allConfigs = parsedLinks.map(link => link.raw);
    const configsText = allConfigs.join('\n\n');
    copyToClipboard(configsText, configsText);
    setCopyAllSuccess(true);
    setTimeout(() => setCopyAllSuccess(false), 2000);
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <span className="text-xl">🔗</span>
          {t('config.title')}
        </h2>
        <button
          onClick={handleCopyAll}
          className={`group flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg ${
            copyAllSuccess 
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
      
      <div className="max-h-[400px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
        {/* Subscription Link */}
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
                onClick={handleCopySubscription}
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

        {parsedLinks.map((link, index) => {
          const copied = isCopied(link.raw);
          
          return (
            <div
              key={index}
              className="group relative p-3 rounded-lg border bg-card hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                {/* Protocol Badge */}
                <div className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase flex-shrink-0">
                  {link.protocol}
                </div>
                
                {/* Emoji */}
                {link.emoji && (
                  <span className="text-sm">{link.emoji}</span>
                )}
                
                {/* Name */}
                <div className="flex-1 min-w-0 text-xs font-medium text-foreground truncate">
                  {link.name}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(link)}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                    }`}
                    title={t('qr.copy')}
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

      {/* QR Modal */}
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

