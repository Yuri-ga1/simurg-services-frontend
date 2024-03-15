import { isUndefined } from '@repo/lib/typescript';

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (isUndefined(value)) {
    throw new Error(`Env variable ${key} is required`);
  }
  return value;
};

export const BACKEND_URL = getEnvVar('BACKEND_URL');
