import { createRequestClient } from '@internal/shared/lib/fetch';
import { BACKEND_URL } from '../config/env';

export type Service = {
  name: string;
  'status-code': number;
};

const requestClient = createRequestClient({
  baseUrl: BACKEND_URL,
  delay: 3000,
});

const getServices = async (): Promise<Service[]> => {
  const data = await requestClient.send<void, { services: Service[] }>({
    url: 'services',
    method: 'GET',
  });
  return data.services;
};

export const api = { getServices };
