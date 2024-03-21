import { createHttpClient } from '@repo/lib/fetch';
import { BACKEND_URL } from '~/config/env';

export type CoordinateCalculationResponse = {
  valid: boolean;
  coordinates: [number, number, number];
};

const httpClient = createHttpClient({
  baseUrl: BACKEND_URL,
});

const calculateCoordinates = async (data: FormData): Promise<CoordinateCalculationResponse> =>
  httpClient.request({
    path: 'coordinates',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

export const api = { calculateCoordinates };
