import { createRequestClient } from '@simurg-microfrontends/shared/api';
import { BACKEND_URL } from '~/config/env';

export type CoordinateCalculationResult = {
  valid: boolean;
  coordinates: [number, number, number];
};

const requestClient = createRequestClient({
  baseUrl: BACKEND_URL,
});

const calculateCoordinates = async (data: FormData): Promise<CoordinateCalculationResult> =>
  requestClient.send({
    url: 'coordinates',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

export const api = { calculateCoordinates };
