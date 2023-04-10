import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import staticData from './modules/common';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, staticData };
export default pinia;
