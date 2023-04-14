<template>
  <div class="wallet-container">
    <div class="item">
      <span class="label">{{ $t('wallet.item.level') }} : </span>
      <span class="num">
        <a-spin :loading="loading1" :size="16" class="load">
          {{ $t(cardData.val.level) }}
        </a-spin>
      </span>
    </div>
    <!-- <div class="item">
        <span class="label">{{ $t('wallet.item.ratio') }} : </span>
        <span class="num">
          <a-spin :loading="loading" :size="16" class="load">
            {{ cardData.val.ratio ? cardData.val.ratio + '%' : ''}}
          </a-spin>  
        </span>
      </div> -->
    <div class="item">
      <span class="label">{{ $t('wallet.item.balance') }} : </span>
      <span class="num">
        <a-spin :loading="loading1" :size="16" class="load">
          {{ cardData.val.balance }}
        </a-spin>
      </span>
      <a-button type="primary" shape="round" size="small" class="btn">{{
        $t('wallet.item.btn')
      }}</a-button>
    </div>
    <div class="item ">
      <span class="label">{{ $t('login.update.pwd') }} : </span>
      <div v-if="viewPass" class="view-pass">
        <span>{{ viewbol ? viewPass : '******' }}</span>
        <icon-eye-invisible v-if="!viewbol" :size="18" @click="viewbol = true"/>
        <icon-eye v-else :size="18" @click="viewbol = false" />
      </div>
      <a-button
        type="primary"
        shape="round"
        size="small"
        class="btn upbtn"
        @click="updatePwd()"
        >{{ $t('login.update.btn') }}</a-button
      >
    </div>
  </div>
  <!-- 修改密码 -->
  <a-modal
    v-model:visible="pwdVisible"
    :title="$t('login.update.pwd')"
    class="modal"
    :mask-closable="false"
  >
    <a-form ref="rulePwdform" :model="inputPwd">
      <a-form-item
        field="oldPwd"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
        style="padding-left: 60px"
      >
        <label style="width: 90px; margin-right: 16px; white-space: nowrap"
          >{{ $t('login.update.label1') }} :</label
        >
        <a-input-password
          v-model="inputPwd.oldPwd"
          :style="{ width: '260px' }"
          allow-clear
          autocomplete="new-password"
        />
      </a-form-item>
      <a-form-item
        field="newPwd"
        :rules="[
          { required: true, message: $t('login.form.password.errMsg') },
          {
            match: /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,12}$/,
            message: $t('login.update.pwdrule'),
          },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
        style="padding-left: 60px"
      >
        <label style="width: 90px; margin-right: 16px; white-space: nowrap"
          >{{ $t('login.update.label2') }} :</label
        >
        <a-input-password
          v-model="inputPwd.newPwd"
          :style="{ width: '260px' }"
          allow-clear
          autocomplete="new-password"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="pwdCancel">{{ $t('login.modal.cancel2') }}</a-button>
      <a-button :loading="btnDisable" type="primary" @click="okUpdate">{{
        $t('login.modal.ok2')
      }}</a-button>
    </template>
  </a-modal>

  <!-- 提现 -->
  <a-modal
    v-model:visible="visible"
    :title="$t('financial.modal.title')"
    class="modal"
  >
    <div class="drop" style="width: 320px; margin: 0 auto">
      <a-form ref="ruleform" :model="formInfo">
        <a-form-item
          field="inputVal"
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="formInfo.inputVal"
            :style="{ width: '320px' }"
            :placeholder="$t('financial.withdrawn.pwd')"
            allow-clear
            autocomplete="new-password"
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button @click="handleCancel">{{ $t('login.modal.cancel2') }}</a-button>
      <a-button :loading="btnDisable" type="primary" @click="withdrawn">{{
        $t('login.modal.ok2')
      }}</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, onActivated, onDeactivated } from 'vue';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useUser from '@/hooks/user';
  
  const emit = defineEmits(['get-user']);
  const { logout } = useUser();
  const { t } = useI18n();
  const loading1: any = ref(null);
  const loading2: any = ref(null);
  // const { loading, setLoading } = useLoading(true);
  const address: any = ref('');
  const email: any = ref('');
  const visible = ref(false);
  const ruleform: any = ref(null); // 验证表单
  const btnDisable: any = ref(false);
  const level: any = ref(0);
  const viewPass = ref<string>('');
  const formInfo: any = ref({
    inputVal: '',
  });
  const cardData = reactive({
    val: {
      level: 'agent.level0',
      ratio: '',
      balance: '',
    },
  });

  // 提现
  const inputModal = () => {
    if (!Number(cardData.val.balance)) return;
    visible.value = true;
  };
  const handleCancel = () => {
    visible.value = false;
    formInfo.value.inputVal = '';
  };

  // const web3obj = new Web3((Web3 as any).givenProvider);
  // const { ethereum } = window as any; // 获取小狐狸实例
  // const toBalanceValue = 7000000000000000000;
  // const balanceValue =
  const withdrawn = () => {
    ruleform.value.validate(async (res: any) => {
      // eslint-disable-next-line eqeqeq
      if (res == undefined) {
        // btnDisable.value = true;
        // 验证密码
        // ---
        // const balanceVal = await web3obj.eth.getBalance(address.value)
        // eth转wei 转账 web3.utils.toWei('1', 'ether')
        // toBalanceValue = await Web3.utils.toWei(balanceVal, 'ether');
        // console.log(toBalanceValue)
        // Web3.eth.sendTransaction({
        //   from: '0xf7fB89554f842F550499AEf4FDa2d1898039851f',
        //   to: '0x100E077e5111C044673114dfe917C807dd60f0D1',
        //   value: toBalanceValue,
        // }, (err: any, addr: any) => {
        //   if (!err) {
        //     console.log(addr, '转账成功！');
        //   } else {
        //     console.log(err);
        //   }
        // });
        // axios
        //   .get(
        //     // `/api/user/alltransfer?address=${address.value}&email=${email.value}&personalreward=${cardData.val.balance}`,
        //     `/api/user/alltransfer?address=${address.value}&email=${email.value}&personalreward=0.1`,
        //   )
        //   .then((result: any) => {
        //     if ( result.data.code === 200 && result.data.data ) {
        //       Message.success(t('wallet.item.withdrawn.succ'))
        //       visible.value = false;
        //       // eslint-disable-next-line no-use-before-define
        //       getBalance();
        //     }else{
        //       Message.error(t('wallet.item.withdrawn.err'))
        //     }
        //   }).finally(()=>{
        //     btnDisable.value = false;
        //   })
      }
    });
  };

  // 获取等级、返佣比
  const getLevel = () => {
    // eslint-disable-next-line no-multi-assign
    loading1.value = loading2.value = true;
    axios
      .get(`/api/user/getuser?address=${address.value}`)
      .then((res: any) => {
        const resData: any = res.data.data
        if (res.data.code === 200 && resData) {
          cardData.val.balance = (Math.floor(resData.personalrewards * 100) / 100).toFixed(2) || '0.00';
          // eslint-disable-next-line vue/custom-event-name-casing
          emit('get-user', resData.id);
          level.value = resData.level;
          email.value = resData.email;
          // eslint-disable-next-line eqeqeq
          if (resData.level == '4') {
            cardData.val.level = 'agent.level1';
            // eslint-disable-next-line eqeqeq
          } else if (resData.level == '3') {
            cardData.val.level = 'agent.level2';
            // eslint-disable-next-line eqeqeq
          } else if (resData.level == '2') {
            cardData.val.level = 'agent.level3';
          } else {
            cardData.val.level = 'agent.level4';
          }
        } else {
          cardData.val.level = '--';
          // eslint-disable-next-line vue/custom-event-name-casing
          emit('get-user', 'false');
        }
      })
      .catch(() => {
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('get-user', 'false');
      })
      .finally(() => {
        loading1.value = false;
      });
    const mylevel = String(localStorage.getItem('userLl'));
    axios
      .get(`/api/sys/commission?level=${mylevel}`)
      .then((res: any) => {
        if (res.data.code === 200 && res.data.data) {
          cardData.val.ratio = `${Number(res.data.data.systemval) * 100}`;
        }
      })
      .finally(() => {
        loading2.value = false;
      });
  };

  // 获取余额
  const getBalance = () => {
    axios.get(`/api/user/getuser?address=${address.value}`).then((res: any) => {
      if (res.data.code === 200) {
        cardData.val.balance =
          (Math.floor(res.data.data.personalrewards * 100) / 100).toFixed(2) ||
          '0.00';
      }
    });
  };



  // 修改密码
  const pwdVisible = ref(false);
  const rulePwdform: any = ref(null);
  const inputPwd: any = ref({
    oldPwd: '',
    newPwd: '',
  });
  const pwdCancel = () => {
    pwdVisible.value = false;
    inputPwd.value = {
      oldPwd: '',
      newPwd: '',
    };
  };
  const updatePwd = () => {
    pwdVisible.value = true;
  };
  const okUpdate = () => {
    rulePwdform.value.validate(async (res: any) => {
      // eslint-disable-next-line eqeqeq
      if (res == undefined) {
        btnDisable.value = true;
        try {
          await axios
            .put(
              `/api/user/updatePassword?email=${email.value}&lastps=${inputPwd.value.oldPwd}&ps=${inputPwd.value.newPwd}`
            )
            .then((result: any) => {
              console.log(result);
              // eslint-disable-next-line eqeqeq
              if (result.data.code == 200 && result.data.data) {
                Message.success(t('login.update.succ'));
                pwdVisible.value = false;
                logout();
              } else {
                Message.error(t('login.update.err'));
              }
              btnDisable.value = false;
            });
        } catch (error: any) {
          Message.error(error.message);
          btnDisable.value = false;
        }
      }
    });
  };

  const viewbol = ref<boolean>(false)
  const getPass = () => {
    axios.get('/api//user/getPass').then((res: any)=>{
      if( res.data.code === 200 ){
        viewPass.value = res.data.data
      }
    })
  }

  // 轮询获取余额
  let bTimer: any = null;
  onActivated(() => {
    bTimer = window.setInterval(() => {
      getBalance();
    }, 60000);
  });
  onDeactivated(() => {
    clearInterval(bTimer);
  });

  onMounted(() => {
    address.value = localStorage.getItem('address');
    email.value = localStorage.getItem('userEm');
    getLevel();
    getPass()
  });
</script>

<style lang="less" scoped>
  .wallet-container {
    padding: 30px 0;
    border: 1px solid #e5e8ef;
    border-radius: 4px;
    .item {
      display: flex;
      align-items: center;
      padding: 14px 30px;
      transition: all .2s ease;

      .label {
        padding-right: 18px;
        color: var(--color-text-2);
        font-size: 16px;
      }

      .num {
        color: var(--color-text-1);
        font-size: 18px;

        .load {
          margin-bottom: 0px !important;
        }
      }

      .btn {
        margin-left: 80px;
        border-radius: 4px;
      }

      .upbtn {
        margin-left: 0;
      }
    }

    &:hover {
      box-shadow: 1px 1px 3px #e5e8ef;
    }
  }
  .view-pass{
    margin-right: 23px;
    svg{
      cursor: pointer;
      margin-left: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .wallet-container {
      padding: 0 !important;

      .item {
        padding: 16px 20px !important;
        overflow: hidden;

        .btn {
          float: right;
          margin-left: 0 !important;
        }
      }
    }
  }
</style>
