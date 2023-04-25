import { defineStore } from 'pinia';

const staticData = defineStore('common', {
  state: () => {
    return {
      isAssetsAllow: false,
      userAddress: '',
      badgeData: [],
      isRefresh: false,
      showbind: false,
      menuHidden: '', // c-user login show menu: by level
      isRouteActive: false,
    };
  },

  getters: {},

  actions: {
    updateShowBind(newValue: any){
      this.showbind = newValue;
    },
    updateRouteActive(newValue: any){
      this.isRouteActive = newValue;
    }
  },
});

export default staticData;
