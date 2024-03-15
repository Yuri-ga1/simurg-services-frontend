export class ApiError {
  constructor(public message: string) {}
}

export class NetworkError extends ApiError {}

export class PreparationError extends ApiError {}

export class HttpError extends ApiError {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export enum HttpErrorStatus {
  SERVER = 500,
  BAD_DATA = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

const createHttpError = (status: HttpErrorStatus): new (message: string) => HttpError =>
  class extends HttpError {
    constructor(public message: string) {
      super(status, message);
    }
  };

export const ServerError = createHttpError(HttpErrorStatus.SERVER);
export const BadDataError = createHttpError(HttpErrorStatus.BAD_DATA);
export const UnauthorizedError = createHttpError(HttpErrorStatus.UNAUTHORIZED);
export const ForbiddenError = createHttpError(HttpErrorStatus.FORBIDDEN);
export const NotFoundError = createHttpError(HttpErrorStatus.NOT_FOUND);
export const ConflictError = createHttpError(HttpErrorStatus.CONFLICT);

export const isApiError = (error: any): error is ApiError => error instanceof ApiError;

export const isNetworkError = (error: any): error is HttpError => error instanceof HttpError;

export const isPreparationError = (error: any): error is PreparationError =>
  error instanceof PreparationError;

export const isHttpError = (error: any): error is HttpError => error instanceof HttpError;
