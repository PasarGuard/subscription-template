import { REPO_URL } from '@/constants/project';
import { useSupportUrl } from '@/hooks/useUserData';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import type { FC } from 'react';

const FooterContent = () => {
  const { t } = useTranslation();
  const { supportUrl } = useSupportUrl();

  return (
    <div className="flex flex-col items-center gap-3">
      {supportUrl && (
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {t('userInfo.supportUrl')}
        </a>
      )}
      {supportUrl && (
        <Separator className="w-16" />
      )}
      <p className="inline-block flex-grow text-center text-xs text-muted-foreground lg:px-4">
        Made with ❤️ by &nbsp;
        <a className="text-primary hover:text-primary/80 transition-colors" href={REPO_URL} target="_blank" rel="noopener noreferrer">
          PasarGuard Team
        </a>
      </p>
    </div>
  );
};

export const Footer: FC = ({ ...props }) => {
  return (
    <div dir='ltr' className="relative w-full pb-8 pt-6 px-6" {...props}>
      <div className="container mx-auto max-w-7xl flex justify-center">
        <FooterContent />
      </div>
    </div>
  );
};
