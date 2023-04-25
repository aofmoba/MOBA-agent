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
  import Cookies from 'js-cookie'
  import axios from 'axios';
  
  export default defineComponent({
    components: {
      GlobalSetting,
    },
    setup() {
      const router = useRouter();
      const comStore = staticData();
      const { isRefresh } = storeToRefs(comStore);
      const { logout } = useUser();

      onMounted(async() => {
        const { ethereum } = window as any;
        if( localStorage.getItem('address') && ethereum){
          ethereum.on('accountsChanged', (accounts: any) => {
            console.log(accounts[0]); // 一旦切换账号这里就会执行
            if( router.currentRoute.value.name === 'login' ) isRefresh.value = true;
            // logout();
          });
        }
        if( Cookies.get('user_login_com') ){
            const exdata = JSON.parse(Cookies.get('user_login_com'))
            // eslint-disable-next-line eqeqeq
            if( localStorage.getItem('address') == exdata.address && localStorage.getItem('isLogin') == 'true' ) return
            // eslint-disable-next-line eqeqeq
            if( exdata.address && exdata.level !== '1' ){
              Cookies.set('satoken', exdata.satoken, { expires: 30, path: '', domain: 'node.aof.games' })
              localStorage.setItem('userLl', exdata.level);
              localStorage.setItem('userEm', exdata.email);
              localStorage.setItem('address', exdata.address);
              localStorage.setItem('isLogin', 'true');
              await axios.get(`/api/user/doLogin?address=${exdata.address}`)
            }
        } else if (Cookies.get('user_login_com') === undefined) {
            // logout()
        }
      });
      return {
        locale: enUS,
      };
    },
  });
</script>
