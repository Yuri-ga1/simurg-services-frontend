import { type Resource } from 'i18next';
import { useTranslation } from 'react-i18next';
import { i18nService } from './i18n-service';

export const createUseTranslation =
  (key: string, resources: Resource) =>
  (namespace?: string): ReturnType<typeof useTranslation> => {
    const instance = i18nService.getInstance(key, { resources });
    return useTranslation(namespace, { i18n: instance });
  };
