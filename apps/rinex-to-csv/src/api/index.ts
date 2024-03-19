import { createHttpClient } from '@repo/lib/fetch';
import { BACKEND_URL } from '../config/env';

export type TimeStep = 10 | 30 | 60 | 120;

export enum NavigationMeasurement {
  L1C = 'L1C',
  C1C = 'C1C',
  L2I = 'L2I',
  C2I = 'C2I',
}

export enum NavigationSystem {
  GPS = 'GPS',
  GLONASS = 'GLONASS',
  GALILEO = 'Galileo',
  BEI_DOU = 'BeiDou',
  SBAS = 'SBAS',
}

export enum NavigationType {
  G_SIGNALS = 'g_signals',
  R_SIGNALS = 'r_signals',
  E_SIGNALS = 'e_signals',
  C_SIGNALS = 'c_signals',
  S_SIGNALS = 's_signals',
}

export type NavigationOption = {
  type: NavigationType;
  measurements: NavigationMeasurement[];
};

export type UploadRinexResponse = {
  filename: string;
  proc_id: string;
};

export type UploadNavResponse = UploadRinexResponse;

export type CalculateCoordinatesData = {
  [NavigationType.G_SIGNALS]: NavigationMeasurement[];
  [NavigationType.R_SIGNALS]: NavigationMeasurement[];
  [NavigationType.E_SIGNALS]: NavigationMeasurement[];
  [NavigationType.C_SIGNALS]: NavigationMeasurement[];
  [NavigationType.S_SIGNALS]: NavigationMeasurement[];
  timestep: TimeStep;
};

const httpClient = createHttpClient({
  baseUrl: BACKEND_URL,
  withCredentials: true,
});

const uploadRinexFile = async (data: FormData): Promise<UploadRinexResponse> =>
  httpClient.request({
    path: 'upload_rinex',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

const uploadNavFile = async (data: FormData): Promise<UploadNavResponse> =>
  httpClient.request({
    path: 'upload_nav',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

const calculateCoordinates = async (data: CalculateCoordinatesData): Promise<unknown> =>
  httpClient.request({
    path: 'run',
    method: 'POST',
    data,
    responseType: 'stream',
  });

const getResult = async (): Promise<ArrayBuffer> =>
  httpClient.request({
    path: 'get_result',
    method: 'GET',
    responseType: 'arraybuffer',
  });

export const api = { uploadRinexFile, uploadNavFile, calculateCoordinates, getResult };
