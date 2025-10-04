import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UseCopyToClipboardReturn {
  copiedId: string | null;
  copyToClipboard: (text: string, id?: string) => Promise<boolean>;
  isCopied: (id?: string) => boolean;
}

export function useCopyToClipboard(
  timeout: number = 2000
): UseCopyToClipboardReturn {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { t } = useTranslation();

  const copyToClipboard = useCallback(
    async (text: string, id?: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        toast.error(t('clipboard.notSupported') || 'Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id || 'default');
        
        toast.success(t('clipboard.copied') || 'Copied to clipboard!', {
          duration: 2000,
        });

        // Reset after timeout
        setTimeout(() => {
          setCopiedId(null);
        }, timeout);

        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error(t('clipboard.failed') || 'Failed to copy');
        return false;
      }
    },
    [timeout, t]
  );

  const isCopied = useCallback(
    (id?: string): boolean => {
      return copiedId === (id || 'default');
    },
    [copiedId]
  );

  return {
    copiedId,
    copyToClipboard,
    isCopied,
  };
}

