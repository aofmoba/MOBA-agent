import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import axios from 'axios';
import Cookies from 'js-cookie'
import { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    // setInfo(partial: Partial<UserState>) {
    //   this.$patch(partial);
    // },
    setInfo(partial: any) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      // const res = await getUserInfo();

      this.setInfo(null);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Logout
    async logout() {
      // await userLogout();
      const address = localStorage.getItem('address')
      if( localStorage.getItem('isLogin') ){
        axios.get(`/api/user/outLogin?address=${ address }`)
      }
      localStorage.removeItem('isLogin')
      localStorage.removeItem('bImg')
      localStorage.removeItem('userLl')
      localStorage.removeItem('userEm')
      localStorage.removeItem('address')
      Cookies.remove('satoken', { expires: 30, path: '/', domain: 'aof.games' })
      Cookies.remove('satoken', { expires: 30, path: '/', domain: 'node.aof.games' })
      Cookies.remove('user_login_com', { domain: 'aof.games' })
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
  },
});

export default useUserStore;
