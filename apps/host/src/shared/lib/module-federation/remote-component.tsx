import { importRemote } from '@module-federation/utilities';
import { lazy, type ReactNode, Suspense, type FC } from 'react';
import { ErrorBoundary } from '../react';

type RemoteComponentProps = {
  url: string;
  scope: string;
  module: string;
  fallback?: string | ReactNode;
};

export const RemoteComponent: FC<RemoteComponentProps> = ({ url, scope, module, fallback }) => {
  const Component = lazy(async () =>
    importRemote({
      url,
      scope,
      module,
    }),
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};
