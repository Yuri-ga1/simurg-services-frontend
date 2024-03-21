import { Text } from '@mantine/core';
import { importRemote } from '@module-federation/utilities';
import { lazy, type ReactNode, Suspense, type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from '~/shared/lib/i18next';

const ErrorFallback: FC = () => {
  const { t } = useTranslation();

  return <Text>{t('remoteComponent.error')} 😔</Text>;
};

type RemoteComponentProps = {
  url: string;
  scope: string;
  module: string;
  remoteEntryFileName?: string;
  fallback?: ReactNode;
};

export const RemoteComponent: FC<RemoteComponentProps> = ({
  url,
  scope,
  module,
  remoteEntryFileName,
  fallback,
}) => {
  const Component = lazy(async () => {
    try {
      return await importRemote({
        url,
        scope,
        module,
        remoteEntryFileName,
      });
    } catch {
      return { default: ErrorFallback };
    }
  });

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
