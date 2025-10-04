import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTimeAgo } from '@/lib/dateFormatter';

type OnlineBadgeProps = {
  lastOnline?: string | null;
  showText?: boolean;
};

export const OnlineBadge: FC<OnlineBadgeProps> = ({ lastOnline, showText = false }) => {
  const { t } = useTranslation();

  const { text, isOnline } = formatTimeAgo(lastOnline, t);

  const renderBadge = () => {
    if (!lastOnline) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/50" />
          {showText && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
      );
    }

    if (isOnline) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
          </div>
          {showText && <span className="text-sm text-green-600 dark:text-green-400 font-medium">{text}</span>}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/60" />
        {showText && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  };

  return (
    <div className="inline-flex items-center" title={text}>
      {renderBadge()}
    </div>
  );
};

