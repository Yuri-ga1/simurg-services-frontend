import { createHttpClient } from '@repo/lib/fetch';
import { API_URL } from '~/shared/config/env';

export type Service = {
  name: string;
  'status-code': number;
};

const httpClient = createHttpClient({
  baseUrl: API_URL,
});

const getServices = async (): Promise<Service[]> => {
  const response = await httpClient.request<void, { services: Service[] }>({
    path: 'services',
    method: 'GET',
  });
  return response.services;
};

export const api = { getServices };
