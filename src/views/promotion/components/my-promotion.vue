<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="24">
      <div class="title">{{ $t('promotion.title') }}</div>
      <div class="content">
        <div class="card">
          <div v-if="codeInfo.quyuCode && userData.level == 4" class="item">
            <div class="identity"
              ><span>{{ $t('promotion.national') }}</span></div
            >
            <div class="info">
              <div class="subitem">
                <div class="label"
                  >{{ $t('promotion.quyu.code') }} (1 Level):</div
                >
                <div class="num">
                  <a-spin :loading="loading" class="load">
                    {{ codeInfo.quyuCode }}
                  </a-spin>
                </div>
              </div>
              <div class="subitem">
                <div class="label"
                  >{{ $t('promotion.quyu.link') }} (1 Level):</div
                >
                <div class="num">
                  <a
                    :href="
                      `https://node.aof.games?code=` +
                      codeInfo.quyuCode
                    "
                    target="view_window"
                  >
                    https://node.aof.games?code={{ codeInfo.quyuCode }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              (codeInfo.quyuCode || codeInfo.partnerCode) &&
              userData.level >= 3 &&
              Number(userData.SubLevel) >= 1 &&
              Number(userData.SubLevel) < 8
            "
            class="item"
          >
            <div class="identity"
              ><span>{{ $t('promotion.national') }}</span></div
            >
            <div
              v-if="
                Number(userData.SubLevel) >= 1 && Number(userData.SubLevel) < 8
              "
              class="info"
            >
              <div class="subitem">
                <div class="label"
                  >{{
                    $t('promotion.quyu.code') +
                    '(' +
                    (Number(userData.SubLevel) + 1) +
                    ' Level)'
                  }}:</div
                >
                <div class="num">
                  <a-spin :loading="loading" class="load">
                    {{ codeInfo.quyuCode }}
                  </a-spin>
                </div>
              </div>
              <div class="subitem">
                <div class="label"
                  >{{
                    $t('promotion.quyu.link') +
                    '(' +
                    (Number(userData.SubLevel) + 1) +
                    ' Level)'
                  }}:</div
                >
                <div class="num">
                  <a
                    :href="
                      `https://node.aof.games?code=` +
                      codeInfo.quyuCode
                    "
                    target="view_window"
                  >
                    https://node.aof.games?code={{ codeInfo.quyuCode }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-if="!loading" class="item"> -->
          <div v-if="false" class="item">
            <div class="info">
              <div class="subitem">
                <div class="label">{{ $t('promotion.purchase.link') }} :</div>
                <div class="num">
                  <a
                    :href="`https://dealers.cyberpop.online${codeInfo.userCode ? '?code='+ codeInfo.userCode : ''}`"
                    target="view_window"
                  >
                    {{
                      'https://dealers.cyberpop.online'+ (codeInfo.userCode ? '?code='+codeInfo.userCode : '')
                    }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a-skeleton
            v-if="
              !codeInfo.userCode && !codeInfo.partnerCode && !codeInfo.quyuCode && loading
            "
            :animation="true"
            :loading="loading"
            style="padding: 30px"
          >
            <a-space
              direction="vertical"
              :style="{ width: '100%' }"
              size="large"
            >
              <a-skeleton-line :rows="4" />
              <a-skeleton-shape />
            </a-space>
          </a-skeleton>
        </div>
      </div>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { staticData } from '@/store';
  import { storeToRefs } from 'pinia';

  const comStore = staticData();
  const { t } = useI18n();
  const email: any = ref('');
  const address: any = ref('');
  const userData: any = ref({});
  const codeInfo: any = ref({
    userCode: '',
    partnerCode: '',
    quyuCode: '',
  });
  const { loading, setLoading } = useLoading(true);

  const getCode = async () => {
    setLoading(true);
    await axios
      .get(`/api/user/getuser?address=${address.value}`)
      .then((res: any) => {
        if (res.data.code === 200) {
          userData.value = res.data.data;
        }
      });
    await axios
      .get(`/api/user/getdata?email=${email.value}`)
      .then((res: any) => {
        if (res.data.code === 200) {
          setLoading(false);
          codeInfo.value.userCode = res.data.data.threeClass
            ? res.data.data.threeClass
            : '';
          codeInfo.value.partnerCode = res.data.data.twoClass
            ? res.data.data.twoClass
            : '';
          codeInfo.value.quyuCode = res.data.data.OneClass
            ? res.data.data.OneClass
            : '';
        }else{
          setLoading(false);
        }
      })
  };

  onMounted(() => {
    email.value = localStorage.getItem('userEm');
    address.value = localStorage.getItem('address');
    getCode();
  });
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }

  .panel-col {
    .title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .content {
      padding: 30px 0;

      .card {
        margin: 16px 20px;
        border: 1px solid var(--color-neutral-3);
        border-radius: 4px;

        .item {
          display: flex;

          .identity {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 210px;
            padding: 10px;
            color: var(--color-text-1);
            font-size: 16px;
            text-align: center;
            border-right: 1px solid var(--color-neutral-3);
          }

          .badge {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 160px;
            min-width: 100px;
            border-right: 1px solid var(--color-neutral-3);

            img {
              width: 90%;
            }
          }

          .info {
            display: flex;
            flex-direction: column;
            width: 100%;

            .subitem {
              display: flex;
              flex: 1;
              width: 100%;
              padding: 20px 20px;

              .label {
                padding-right: 18px;
                color: var(--color-text-2);
                font-size: 16px;
                white-space: nowrap;
                text-align: left;
              }

              .num {
                color: rgb(var(--primary-6));
                font-size: 16px;

                .load {
                  width: 60px;
                }

                a {
                  color: rgb(var(--primary-6));
                }

                a:hover {
                  color: blue;
                }
              }
            }

            .subitem + .subitem {
              border-top: 1px solid var(--color-neutral-3);
            }

            .subitem:hover {
              background: var(--color-neutral-1);
            }
          }
        }

        .item + .item {
          border-top: 1px solid var(--color-neutral-3);
        }

        .nothing {
          padding: 40px 30px;
          color: var(--color-text-1);
          text-align: center;
        }

        &:hover {
          box-shadow: 1px 1px 3px #e5e8ef;
        }
      }
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .content {
      width: 800px;
    }
  }
</style>
