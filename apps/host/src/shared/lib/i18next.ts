import { createUseTranslation } from '@repo/lib/i18next';
import { locales } from '../config/locales';

export const useTranslation = createUseTranslation(APP_NAME, locales);
