import { createHttpClient } from '@repo/lib/fetch';
import { API_URL } from '~/config/env';
import type { GraphDataItem, TaskIdAndGraphData } from '~/ui/graphs/heatmap/config';
import type { SignalData } from '~/ui/graphs/linear/config';

export type GraphTS = 10 | 15 | 20 | 30;

const httpClient = createHttpClient({
  baseUrl: API_URL,
});

const uploadNavFile = async (data: FormData): Promise<TaskIdAndGraphData> =>
  httpClient.request({
    path: 'upload_data',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

const getDatasForDetailedGraphs = async (
  task_id: string,
  data_period = 15,
): Promise<GraphDataItem[]> =>
  httpClient.request({
    path: 'find_holes_in_data',
    method: 'POST',
    data: JSON.stringify({ task_id, data_period }),
    headers: { 'Content-Type': 'application/json' },
  });

const getSatelliteData = async (data: FormData): Promise<SignalData> =>
  httpClient.request({
    path: 'fetch_satellite_info',
    method: 'POST',
    data,
    contentType: 'application/json',
  });

export const api = { getDatasForDetailedGraphs, uploadNavFile, getSatelliteData };
