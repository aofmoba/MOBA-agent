import { createI18n } from 'vue-i18n';
import en from './en-US';
import zh from './zh-CN';

export const LOCALE_OPTIONS = [
  { label: 'English', value: 'en-US' },
  { label: 'Chinese', value: 'zh-CN' },
];
const defaultLocale = localStorage.getItem('arco-locale') || 'en-US';

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en-US',
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': zh,
  },
});

export default i18n;
