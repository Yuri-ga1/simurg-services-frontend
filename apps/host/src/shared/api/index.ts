import { createRequestClient } from '@internal/shared/lib/fetch';
import { BACKEND_URL } from '../config/env';

export type BackendService = {
  name: string;
  'status-code': number;
};

const requestClient = createRequestClient({
  baseUrl: BACKEND_URL,
  delay: 3000,
});

const getBackendServices = async (): Promise<BackendService[]> => {
  const data = await requestClient.send<void, { services: BackendService[] }>({
    url: 'services',
    method: 'GET',
  });
  return data.services;
};

export const api = { getBackendServices };
