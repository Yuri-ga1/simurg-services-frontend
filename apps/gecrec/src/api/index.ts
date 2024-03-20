import { createHttpClient } from '@repo/lib/fetch';
import { BACKEND_URL } from '../config/env';

export type GetCentersResponse = {
  available_centers: string[];
};

export type GetCenterAvailabilityQuery = {
  center: string;
};

export type GetCenterAvailabilityResponse = {
  begin: string;
  end: string;
};

export type GetResultQuery = {
  center: string;
  begin: string;
  end: string;
  min_lat: number;
  max_lat: number;
  min_lon: number;
  max_lon: number;
  geomag: string;
  send_rec: boolean;
  send_wmt: boolean;
};

export type DownloadResultQuery = GetResultQuery;

export type GetResultResponse = {
  rec?: number[];
  timestamps: number[];
  average_mean_tec?: number[];
};

const httpClient = createHttpClient({
  baseUrl: BACKEND_URL,
});

const getCenters = async (): Promise<string[]> => {
  const data: GetCentersResponse = await httpClient.request({
    path: 'centers',
    method: 'GET',
  });
  return data.available_centers;
};

const getCenterAvailability = async (
  query: GetCenterAvailabilityQuery,
): Promise<GetCenterAvailabilityResponse> =>
  httpClient.request({
    path: 'availability',
    method: 'GET',
    query,
  });

const getResult = async (query: GetResultQuery): Promise<GetResultResponse> =>
  httpClient.request({
    path: '',
    method: 'GET',
    query,
  });

const downloadResult = async (query: DownloadResultQuery): Promise<ArrayBuffer> =>
  httpClient.request({
    path: 'csv',
    method: 'GET',
    responseType: 'arraybuffer',
    query,
  });

export const api = { getCenters, getCenterAvailability, getResult, downloadResult };
