import { type DependencyList, useCallback, useState } from 'react';

export type FetchStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type UseAsyncCallbackHandlers<TData, TError extends unknown, TArgs extends any[]> = {
  onSuccess?: (data: TData, args: TArgs) => void;
  onError?: (error: TError, args: TArgs) => void;
};

export type UseAsyncCallbackReturn<TData, TError, TArgs extends any[]> = [
  data: Nullable<TData>,
  callback: (...args: TArgs) => Promise<void>,
  {
    error: Nullable<TError>;
    isLoading: boolean;
    isLoaded: boolean;
    isFailed: boolean;
  },
];

export const useAsyncCallback = <TData, TError extends unknown, TArgs extends any[]>(
  asyncFn: (...args: TArgs) => Promise<TData>,
  { onSuccess, onError }: UseAsyncCallbackHandlers<TData, TError, TArgs> = {},
  deps: DependencyList = [],
): UseAsyncCallbackReturn<TData, TError, TArgs> => {
  const [data, setData] = useState<Nullable<TData>>(null);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<Nullable<TError>>(null);

  const callback = useCallback(
    async (...args: TArgs) => {
      setStatus('pending');
      try {
        const newData = await asyncFn(...args);
        onSuccess?.(newData, args);
        setData(newData);
        setStatus('fulfilled');
      } catch (_error) {
        onError?.(_error as TError, args);
        setError(_error as TError);
        setStatus('rejected');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  const isLoading = status === 'pending';
  const isLoaded = status === 'fulfilled';
  const isFailed = status === 'rejected';

  return [data, callback, { error, isLoading, isLoaded, isFailed }];
};
