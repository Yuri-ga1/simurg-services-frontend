import { createRequestClient } from '@simurg-microfrontends/shared/api';
import { BACKEND_URL } from '../config/env';

export type GetBackendServicesResponse = {
  services: BackendService[];
};

export type BackendService = {
  name: string;
  'status-code': number;
};

const requestClient = createRequestClient({
  baseUrl: BACKEND_URL,
  delay: 3000,
});

const getBackendServices = async (): Promise<BackendService[]> => {
  const data = await requestClient.send<void, GetBackendServicesResponse>({
    url: 'services',
    method: 'GET',
  });
  return data.services;
};

export const api = { getBackendServices };
