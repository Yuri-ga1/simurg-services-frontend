import i18next, { type i18n, type InitOptions as BaseInitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export type InitOptions = Omit<
  BaseInitOptions,
  'initImmediate' | 'debug' | 'fallbackLng' | 'supportedLngs' | 'interpolation' | 'detection'
>;

const FALLBACK_LNG = 'en';
const DEFAULT_INIT_OPTIONS: BaseInitOptions = {
  fallbackLng: FALLBACK_LNG,
  supportedLngs: [FALLBACK_LNG, 'ru'],
  detection: {
    order: ['localStorage'],
  },
  initImmediate: false,
};

export const i18nService = {
  instances: new Map<string, i18n>(),
  getInstance(key: string, initOptions?: InitOptions): i18n {
    if (this.instances.has(key)) {
      return this.instances.get(key) as i18n;
    }
    return this.createInstance(key, initOptions);
  },
  getCurrentLanguage(): string {
    return [...this.instances.values()][0]?.language ?? FALLBACK_LNG;
  },
  createInstance(key: string, options?: InitOptions): i18n {
    const initOptions: BaseInitOptions = {
      ...options,
      ...DEFAULT_INIT_OPTIONS,
    };
    const newInstance = i18next.createInstance().use(initReactI18next).use(LanguageDetector);
    newInstance.init(initOptions);
    this.instances.set(key, newInstance);
    return newInstance;
  },
  changeLanguage(language: string): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const instance of this.instances.values()) {
      instance.changeLanguage(language);
    }
  },
};
