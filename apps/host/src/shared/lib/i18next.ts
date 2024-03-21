import { createUseTranslation } from '@repo/lib/i18next';
import { translations } from '~/shared/config/translations';

export const useTranslation = createUseTranslation(APP_NAME, translations);
