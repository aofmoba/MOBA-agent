<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="methods">
      <div :class="!choose ? 'choose' : ''" @click="exEmail">{{
        $t('login.methods.email')
      }}</div>
      <div :class="choose ? 'choose' : ''" @click="exWallet">{{
        $t('login.methods.wallet')
      }}</div>
    </div>

    <div v-show="choose" class="metamask">
      <a-spin
        :loading="textLoading"
        :size="32"
        tip="loading..."
        style="width: 100%"
      >
        <div v-if="textLoading" class="login-type empty"> </div>
        <div v-else>
          <!-- 已注册 -->
          <div v-if="[1, 2, 3, 4].includes(level)" class="login-type">
            <div class="login-form-title">
              <!-- {{
                userLevel
                  ? $t(userLevel) +
                    (level === 3 ? '(' + subLevel + ' Level)' : '')
                  : ''
              }} -->
              {{ $t(userLevel) }} {{ nickna }}</div
            >
            <div class="tips">{{ $t('login.connect.tips') }}</div>
          </div>
          <!-- 未注册带邀请码 -->
          <div v-else-if="invitCode" class="login-type">
            <div class="login-form-title"
              >{{ $t('login.register.code') }}: {{ invitCode }}</div
            >
            <a-form
              ref="registerRef"
              :model="userInfo"
              class="login-form register-input"
              layout="vertical"
            >
              <a-form-item
                v-if="level === 0 && invitCode"
                field="email"
                :rules="[
                  { required: true, message: $t('login.form.email.errMsg') },
                  { match: /@/, message: $t('login.form.email.ruleMsg') },
                ]"
                :validate-trigger="['change', 'blur']"
                hide-label
              >
                <a-input
                  v-model="userInfo.email"
                  :placeholder="$t('login.form.email.placeholder')"
                >
                  <template #prefix>
                    <icon-email />
                  </template>
                </a-input>
              </a-form-item>
            </a-form>
            <div class="tips">{{ $t('login.register.tips') }}</div>
          </div>
          <!-- 未注册未带邀请码 -->
          <div v-else class="login-type">
            <div class="login-form-title">{{ $t('login.no.tips') }}</div>
          </div>
        </div>
      </a-spin>
      <a-button
        :loading="logDisable"
        type="primary"
        class="login-form-connect"
        long
        @click="filterLogin"
      >
        {{
          ![1, 2, 3, 4].includes(level) && invitCode
            ? $t('agent.register')
            : $t('login.form.login')
        }}
      </a-button>
    </div>

    <div v-show="!choose" class="emailPwd">
      <a-form
        ref="emailForm"
        :model="emailInfo"
        class="email-form"
        layout="vertical"
      >
        <a-form-item
          field="email"
          :rules="[
            { required: true, message: $t('login.form.email.errMsg') },
            { match: /@/, message: $t('login.form.email.ruleMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="emailInfo.email"
            :placeholder="$t('login.form.email.placeholder')"
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="emailInfo.password"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-space :size="16" direction="vertical">
          <a-button
            :loading="pwdDisable"
            type="primary"
            class="login-form-email"
            long
            @click="emailLogin"
          >
            {{ $t('login.form.login') }}
          </a-button>
        </a-space>
      </a-form>
    </div>

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
          src="https://d2cimmz3cflrbm.cloudfront.net/nwhome/metaMask.svg"
          style="width: 38px; margin-right: 10px"
        />
        {{ $t('login.modal.title') }}
      </template>
      <div>{{ $t('login.modal.msg') }}</div>
    </a-modal>
  </div>

  <bindWallet :show="showbind"></bindWallet>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { staticData } from '@/store';
  import axios from 'axios';
  import { storeToRefs } from 'pinia';
  import web3J from '@/utils/web3';
  // eslint-disable-next-line import/extensions
  import Web3 from 'web3/dist/web3.min.js';
  // import contracts from '@/utils/contracts';
  import bindWallet from '@/components/bind-wallet/index.vue';
import { log } from 'console';

  const router = useRouter();
  const { t } = useI18n();
  const comStore = staticData();
  const { userAddress, isRefresh, showbind } = storeToRefs(comStore);
  const noInVisible = ref(false); // metamask下载弹框
  const isReady: any = ref(0); // 自动查询状态
  const userLevel: any = ref(''); // 显示用户等级名称
  const level: any = ref(0); // 存储用户等级
  const subLevel: any = ref(0); // 存储区域用户等级
  const nickna: any = ref('');
  const logDisable: any = ref(false);
  const textLoading: any = ref(false);
  const invitCode: any = ref('');
  const web3obj = new Web3((Web3 as any).givenProvider);
  const { ethereum } = window as any; // 获取小狐狸实例
  const userInfo = reactive({
    address: '',
    email: '',
  });
  const emailInfo = reactive({
    email: '',
    password: '',
  });

  // into workplace
  const goWorkplace = async () => {
    logDisable.value = true;
    axios
      .get(`/api/user/doLogin?address=${userInfo.address}`)
      .then((res: any) => {
        if (res.data.code === 200 && res.data.data[1]) {
          logDisable.value = false;
          Message.success(t('login.success'));
          localStorage.setItem('isLogin', 'true');
          router.push({ name: 'Workplace' });
          localStorage.setItem('userLl', res.data.data[0].level);
          localStorage.setItem('userEm', res.data.data[0].email);
        } else {
          Message.error(t('login.error'));
        }
      });
  };

  // 获取用户信息 已注册、未注册
  const connect = async () => {
    textLoading.value = true;
    isReady.value = 1;
    if (!ethereum) {
      noInVisible.value = true;
    } else {
      await ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async (res: any) => {
          const res0 = await web3obj.utils.toChecksumAddress(res[0]);
          userInfo.address = res0;
          localStorage.setItem('address', res0);
          userAddress.value = res0;
          try {
            await axios
              .get(`/api/user/getuser?address=${userInfo.address}`)
              .then((xres: any) => {
                if (xres.data.code === 200) {
                  isReady.value = 2;
                  logDisable.value = false;
                  textLoading.value = false;
                  if (xres.data.data) {
                    nickna.value = xres.data.data.nikename;
                    level.value = Number(xres.data.data.level);
                    subLevel.value = Number(xres.data.data.SubLevel);
                    // eslint-disable-next-line eqeqeq
                    if (xres.data.data.level == '4') {
                      userLevel.value = 'agent.level1';
                      // eslint-disable-next-line eqeqeq
                    } else if (xres.data.data.level == '3') {
                      userLevel.value = 'agent.level2';
                      // eslint-disable-next-line eqeqeq
                    } else if (xres.data.data.level == '2') {
                      userLevel.value = 'agent.level3';
                      // eslint-disable-next-line eqeqeq
                    } else if (xres.data.data.level == '1') {
                      userLevel.value = 'agent.level4';
                    }
                  }
                }
              })
              .finally(() => {
                textLoading.value = false;
              });
          } catch (error: any) {
            Message.error(error.message);
            isReady.value = 0;
            textLoading.value = false;
          }
        });
    }
  };

  // 注册 - Verify that the mailbox has been registered
  const registerRef: any = ref(null);
  const verification = () => {
    registerRef.value.validate((res: any) => {
      // eslint-disable-next-line eqeqeq
      if (res == undefined) {
        logDisable.value = true;
        axios
          .get(`/api/user/bemail?email=${userInfo.email}`)
          .then((result: any) => {
            if (result.data.data === true) {
              // This mailbox has not been registered
              // eslint-disable-next-line no-use-before-define
              register(userInfo.address, invitCode.value, userInfo.email);
            } else {
              Message.error(t('agent.register.err1'));
            }
          })
          .catch((err: any) => {
            logDisable.value = false;
          });
      }
    });
  };

  // 注册 - 注册接口
  const register = (addr: any, icode: any, email: any) => {
    axios
      .post(
        `/api/business/invuser?address=${addr || 0}&icode=${
          icode || 0
        }&email=${email}&nickname=${0}`
      )
      .then((res: any) => {
        if (res.data.code === 514) {
          // 邮箱错误
          Message.error(t('agent.register.err3'));
          return;
        }
        if (res.data.code === 510) {
          // 当前账号已绑定邮箱
          // eslint-disable-next-line no-use-before-define
          getEmail();
          return;
        }
        if (res.data.code === 506) {
          // 邀请码错误
          Message.error(t('agent.register.err2'));
          return;
        }

        if (res.data.code !== 55555) {
          Message.success('Success');
          connect();
          return;
        }
        Message.error(t('beiz.error'));
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        logDisable.value = false;
      });
  };

  const getEmail = () => {
    axios
      .get(`/api/user/baddress?address=${userInfo.address}`)
      .then((result: any) => {
        Message.success(`"You're bound: "${result.data.data}`);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const filterLogin = () => {
    if (isReady.value === 2) {
      // 已查询用户信息
      if (level.value === 0) {
        // 用户未注册
        verification();
      } else if (level.value === 1) {
        // C端用户
        Message.error(t('cuser.error'));
      } else {
        // 可登录用户
        goWorkplace();
      }
    } else if (isReady.value === 0) {
      // 未查询 或 之前查询失败
      connect();
    } else {
      // 正在查询
      logDisable.value = true;
      Message.loading({
        content: t('login.loading'),
        duration: 1500,
      });
    }
  };

  const toMetaMask = () => {
    window.open('https://metamask.io/');
  };

  // 在当前页监听钱包地址切换，一旦切换自动刷新
  watch(
    isRefresh,
    (newV, oldV) => {
      invitCode.value = router.currentRoute.value.query.code;
      // eslint-disable-next-line no-use-before-define
      if (newV && router.currentRoute.value.name === 'login') {
        // 当在登录页登录方式为钱包登录，切换账号重新查询
        if (isReady.value !== 1) {
          // 数据初始化
          isReady.value = 0;
          userLevel.value = '';
          level.value = 0;
          subLevel.value = 0;
          nickna.value = '';
          userInfo.address = '';
          connect();
          isRefresh.value = false;
        }
      }
    },
    { immediate: true, deep: true }
  );

  // methods
  const choose: any = ref(false);
  const exEmail = () => {
    // exchange email methods
    choose.value = false;
  };
  const exWallet = () => {
    // exchange wallet methods
    choose.value = true;
    // eslint-disable-next-line eqeqeq
    if (isReady.value == 0) {
      connect();
    }
  };

  // email login
  const pwdDisable: any = ref(false);
  const emailForm: any = ref(null);
  const emailLogin = () => {
    emailForm.value.validate(async (res: any) => {
      // eslint-disable-next-line eqeqeq
      if (res == undefined) {
        pwdDisable.value = true;
        try {
          await axios
            .post(
              `/api/user/doLoginEmail?email=${emailInfo.email}&password=${emailInfo.password}`
            )
            .then((result: any) => {
              // console.log(result);
              pwdDisable.value = false;
              if( result.data.data === undefined ){
                Message.error(t('login.email.error1'));
                return
              }
              if (result.data.code === 200 && result.data.data[1]) {
                localStorage.setItem('isLogin', 'true');
                localStorage.setItem('userLl', result.data.data[0].level);
                localStorage.setItem('userEm', result.data.data[0].email);
                if (!result.data.data[0].address) {
                  comStore.updateShowBind(true);
                } else {
                  localStorage.setItem('address', result.data.data[0].address);
                  router.push({ name: 'Workplace' });
                  Message.success(t('login.success'));
                }
              } else if (result.data.code === 513) {
                Message.error(t('login.email.error1'));
              } else if (result.data.code === 515) {
                Message.error(t('login.email.error2'));
              } else if (result.data.code === 516) {
                Message.error(t('login.email.error3'));
              } else {
                Message.error(t('login.email.error3'));
              }
            });
        } catch (error: any) {
          Message.error(error.message);
          pwdDisable.value = false; // 查询结束，按钮的loading结束
        }
      }
    });
  };

  onMounted(() => {
    invitCode.value = router.currentRoute.value.query.code;
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userLl');
    localStorage.removeItem('userEm');
    localStorage.removeItem('address');
  });
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
      margin-bottom: 140px;
    }

    &-badge {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      margin-bottom: 20px;
      padding: 0;
      text-align: center;
      list-style: none;
    }

    &-title {
      width: 400px;
      margin-left: -40px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    // &-change {
    //   margin-bottom: 6px;
    //   font-size: 12px;
    //   span {
    //     cursor: pointer;
    //   }
    // }
    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }

    &-connect {
      width: 100%;
      margin-bottom: 10px;
      border: none;
    }
  }

  .login-form-wrapper {
    .methods {
      display: flex;
      width: 100%;
      height: 40px;
      margin: 20px 0 40px;
      line-height: 40px;
      text-align: center;
      background: #f2f3f5;

      div {
        flex: 1;
        cursor: pointer;

        &:hover {
          opacity: 0.9;
        }
      }

      .choose {
        color: #fff;
        background: #165dff;
      }
    }

    .metamask {
      .login-type {
        min-height: 104px;
        margin-top: -10px;
        padding-bottom: 20px;

        .register-input {
          margin-top: 10px;

          .arco-form-item {
            margin: 0;
          }
        }

        .login-form-title {
          width: 100%;
          margin-left: 0;
        }

        .tips {
          margin-top: 10px;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }

  :deep(.arco-image-footer-caption-title) {
    font-weight: bold;
    font-size: 14px !important;
  }

  .disable {
    cursor: default;
    opacity: 0.6;
    pointer-events: none;
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .login-form {
      &-wrapper {
        margin-bottom: 0;
      }
    }
  }
</style>
