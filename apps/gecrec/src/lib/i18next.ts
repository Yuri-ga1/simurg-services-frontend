import { createUseTranslation } from '@repo/lib/i18next';
import { translations } from '../config/translations';

export const useTranslation = createUseTranslation(APP_NAME, translations);
