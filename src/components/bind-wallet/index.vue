<template>
  <a-modal 
    v-model:visible="showbind" 
    :mask-closable="false"
    @cancel="close"
    hideCancel
    class="bind"
    width="auto"
  >
    <template #title>
      <icon-info-circle-fill />
      {{ $t('login.bind.title') }}
    </template>
    <div>
      <div style="text-align:center;">{{$t('login.bind.msg')}}</div>
    </div>
    <template #footer>
      <div style="text-align: center; margin:10px 0 30px;width: 500px;">
        <a-button style="margin-right: 30px;" @click="close">{{ $t('login.modal.cancel') }}</a-button>
        <a-button :loading="loading" type="primary" @click="bindwallet">{{ $t('login.bind.wallet') }}</a-button>
      </div>
    </template>
  </a-modal>

  <!-- install metamask -->
  <a-modal
    v-model:visible="noInVisible"
    :mask-closable="false"
    simple
    modal-class="inModal"
    :cancel-text="$t('login.modal.cancel')"
    :ok-text="$t('login.modal.open')"
    @ok="toMetaMask"
  >
    <template #title>
      <img
        src="https://cyberpop-page-new.s3-accelerate.amazonaws.com/nwhome/metaMask.svg"
        style="width: 38px; margin-right: 10px"
      />
      {{ $t('login.modal.title') }}
    </template>
    <div>{{ $t('login.modal.msg') }}</div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { staticData } from '@/store';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  // eslint-disable-next-line import/extensions
  import Web3 from 'web3/dist/web3.min.js'

  const { t } = useI18n();
  const router = useRouter();
  const comStore = staticData();
  const { showbind } = storeToRefs(comStore);
  const address: any = ref('');
  const web3obj = new Web3((Web3 as any).givenProvider);
  const { ethereum } = window as any; // 获取小狐狸实例
  const loading: any = ref(false);

  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
  });
  const close = () => {
    comStore.updateShowBind(false);
  }
  const toMetaMask = () => {
    window.open('https://metamask.io/');
  }

  const noInVisible = ref(false); // metamask下载弹框
  const bindwallet = async () => {
    loading.value = true;
    const email: any = localStorage.getItem('userEm');
    if (!ethereum) {
      noInVisible.value = true;
    } else {
      await ethereum
        .request({ method: 'eth_requestAccounts' })
        .then( async (res: any) => {
          const res0 = await web3obj.utils.toChecksumAddress(res[0]);
          // localStorage.setItem('address', res0);
          address.value = res0;
          await axios.post(`/api/user/bindingAddress?email=${email}&address=${res0}`).then((result: any)=>{
            if ( result.data.code === 200 && result.data.data ) {
              comStore.updateShowBind(false);
              localStorage.setItem('address', res0);
              Message.success(t('login.success'));
              router.push({name: 'Workplace'});
            }else if( result.data.code === 517 ) {
              Message.error(t('login.email.error4'));
            } else if( result.data.code === 518 ) {
              Message.error(t('login.email.error5'));
            } else {
              Message.error(t('login.email.error6'));
            }
            loading.value = false;
          })
        })
    }
  }

</script>

<style scoped lang="less">
  .container {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
  }
</style>
