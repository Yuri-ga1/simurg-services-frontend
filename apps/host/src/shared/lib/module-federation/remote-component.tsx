import { importRemote } from '@module-federation/utilities';
import { lazy, type ReactNode, Suspense, type FC } from 'react';
import { ErrorBoundary } from '../react';
import { useTranslation } from '../i18next';

type RemoteComponentProps = {
  url: string;
  scope: string;
  module: string;
  fallback?: ReactNode;
};

export const RemoteComponent: FC<RemoteComponentProps> = ({ url, scope, module, fallback }) => {
  const { t } = useTranslation();

  const Component = lazy(async () =>
    importRemote({
      url,
      scope,
      module,
    }),
  );

  return (
    <ErrorBoundary error={`${t('remoteComponent.error')}  &#9785;&#65039;`}>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
