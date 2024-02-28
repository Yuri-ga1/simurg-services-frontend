import { ApiErrorStatus } from './types';

export class ApiError {
  constructor(public status: ApiErrorStatus) {}
}

const createApiError = (status: ApiErrorStatus): new () => ApiError =>
  class extends ApiError {
    constructor() {
      super(status);
    }
  };

export const ServerError = createApiError(ApiErrorStatus.SERVER);
export const BadDataError = createApiError(ApiErrorStatus.BAD_DATA);
export const UnauthorizedError = createApiError(ApiErrorStatus.UNAUTHORIZED);
export const ForbiddenError = createApiError(ApiErrorStatus.FORBIDDEN);
export const NotFoundError = createApiError(ApiErrorStatus.NOT_FOUND);
export const ConflictError = createApiError(ApiErrorStatus.CONFLICT);
