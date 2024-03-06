export enum ApiErrorStatus {
  SERVER = 500,
  BAD_DATA = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export type ContentType = 'application/json' | 'multipart/form-data';

export type ResponseType = 'json' | 'arraybuffer' | 'stream';

export type RequestMethod = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH';

export type SendRequestOptions<T> = {
  url: string;
  method: RequestMethod;
  data?: T;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  contentType?: ContentType;
  responseType?: ResponseType;
};

export type RequestClient = {
  send: <TData, TResult>(options: SendRequestOptions<TData>) => Promise<TResult>;
};

export type RequestClientInitOptions = {
  baseUrl?: string;
  withCredentials?: boolean;
  delay?: number;
};
