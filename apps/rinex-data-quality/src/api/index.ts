import { createHttpClient } from '@repo/lib/fetch';
import { API_URL } from '~/config/env';
import type { GraphDataItem } from '~/ui/graph/config';

export type GraphTS = 10 | 15 | 20 | 30;

const httpClient = createHttpClient({
  baseUrl: API_URL,
});

const buildGraph = async (data: FormData): Promise<GraphDataItem[]> =>
  httpClient.request({
    path: 'upload_data',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

const getDatasForDetailedGraphs = async (data: FormData): Promise<GraphDataItem[]> =>
  httpClient.request({
    path: 'create_graph_json',
    method: 'POST',
    data,
    contentType: 'multipart/form-data',
  });

export const api = { getDatasForDetailedGraphs, buildGraph };
