import { createHttpClient } from '@repo/lib/fetch';
import { BACKEND_URL } from '~/shared/config/env';

export type Service = {
  name: string;
  'status-code': number;
};

const httpClient = createHttpClient({
  baseUrl: BACKEND_URL,
});

const getServices = async (): Promise<Service[]> => {
  const data = await httpClient.request<void, { services: Service[] }>({
    path: 'services',
    method: 'GET',
  });
  return data.services;
};

export const api = { getServices };
