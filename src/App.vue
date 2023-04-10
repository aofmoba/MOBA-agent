<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import { staticData } from '@/store';
  import { storeToRefs } from 'pinia';
  import useUser from '@/hooks/user';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      GlobalSetting,
    },
    setup() {
      const router = useRouter();
      const comStore = staticData();
      const { userAddress, isRefresh } = storeToRefs(comStore);
      const { logout } = useUser();

      onMounted(() => {
        const { ethereum } = window as any;
        if( localStorage.getItem('address') && ethereum){
          ethereum.on('accountsChanged', (accounts: any) => {
            console.log(accounts[0]); // 一旦切换账号这里就会执行
            if( router.currentRoute.value.name === 'login' ) isRefresh.value = true;
            // logout();
          });
        }
      });
      return {
        locale: enUS,
      };
    },
  });
</script>
