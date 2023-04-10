<template>
  <div class="record-container">
    <a-table
      class="tree"
      column-resizable
      :scroll="{ x: 800, y: 540 }"
      :data="useDate"
      :loading="loading"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <!-- :load-more="moretable" -->
      <template #columns>
        <a-table-column width="240" title="Hash" data-index="hash" />
        <a-table-column width="220" title="Sender">
          <template #cell="{ record }">
            {{ record.sender ? record.sender : 'null' }}
          </template>
        </a-table-column>
        <a-table-column width="220" title="Reciver">
          <template #cell="{ record }">
            {{ record.reciver ? record.reciver : 'null' }}
          </template>
        </a-table-column>
        <a-table-column width="70" title="Amount" data-index="amount" />
        <a-table-column width="90" title="Status">
          <template #cell="{ record }">
            <span v-if="!record.status" style="color: rgb(var(--primary-6))">{{
              record.statustxt ? $t(record.statustxt) : 'null'
            }}</span>
            <span v-else>{{
              record.statustxt ? $t(record.statustxt) : 'null'
            }}</span>
          </template>
        </a-table-column>
        <a-table-column width="120" title="Action">
          <template #cell="{ record }">
            <div class="actionBtn">
              <a-button
                :disabled="record.asyncstatus == 'end' ? true : false"
                type="primary"
                size="mini"
                status="info"
                style="margin-right: 10px"
                @click="syncFun(record.hash)"
              >
                {{ $t('agent.sync') }}
              </a-button>
              <a-button
                :disabled="
                  record.status != 1 && record.asyncstatus == 'end'
                    ? false
                    : true
                "
                type="primary"
                size="mini"
                status="info"
                @click="shareFun(record)"
              >
                {{ $t('agent.share') }}
              </a-button>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { computedDur, vertDate } from '@/utils/computed';
  import { Message } from '@arco-design/web-vue';

  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const address: any = ref('');
  const useDate = ref([]);
  const myUserID: any = ref('');
  const isLeaf: any = ref(false);
  const pagination: any = ref({
    type: 'pagination',
    total: 50,
    current: 1,
    pageSize: 5,
  });
  const props = defineProps({
    userid: String,
  });

  // push children
  const childPush = (resultL: any) => {
    const lenL = resultL.length;
    const children: any = [];
    for (let i = 0; i < lenL; i += 1) {
      children.push({
        hash: resultL[i].hx,
        sender: resultL[i].sender,
        reciver: resultL[i].reciver,
        amount: resultL[i].amount,
        status: resultL[i].readStatus,
        statustxt:
          resultL[i].readStatus === 0
            ? 'wallet.share.status1'
            : 'wallet.share.status2',
        asyncstatus: resultL[i].status || '',
        invCode: resultL[i].invCode,
        isLeaf: true,
      });
    }
    return children;
  };
  // // load more
  // const moretable = (record: any, done: any) => {
  //   axios
  //     .get(`/api/user/getdata?email=${record.email}`)
  //     .then((res: any) => {
  //       if (res.data.code === 200) {
  //           const result = res.data.data;
  //           // eslint-disable-next-line eqeqeq
  //           if( record.level == 3 ){
  //             const children: any = ref([]);
  //             if( result.level3 ){
  //               isLeaf.value = false;
  //               const childrenTemp3: any = childPush(result.level3, true);
  //               children.value.push(...childrenTemp3)
  //             }
  //             if( result.level2 ){
  //               isLeaf.value = false;
  //               const childrenTemp2: any = childPush(result.level2, true);
  //               children.value.push(...childrenTemp2)
  //             }
  //             if( result.level1 ){
  //               isLeaf.value = true;
  //               const childrentemp1: any = childPush(result.level1, true);
  //               children.value.push(...childrentemp1)
  //             }
  //             done(children.value);
  //           // eslint-disable-next-line eqeqeq
  //           }else if( record.level == 2 ){
  //             if( result.level1 ){
  //               isLeaf.value = true;
  //               const children = childPush(result.level1, true);
  //               done(children)
  //             }else{
  //               done([]);
  //             }
  //           }else{
  //             done([]);
  //           }
  //       }else{
  //         done([]);
  //       }
  //     })
  // }

  // pagination
  const onPageChange = async (current: number) => {
    setLoading(true);
    pagination.value.current = current;
    await axios
      .get(
        `/api/dealerHxLog/getAllLog?id=${myUserID.value}&size=${pagination.value.pageSize}&current=${pagination.value.current}`
      )
      .then((res: any) => {
        if (res.data) {
          useDate.value = childPush(res.data.records);
          pagination.value.total = res.data.total;
        } else {
          useDate.value = [];
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUserId = (addr: any) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const res = await axios.get(`/api/user/getuser?address=${addr}`);
      resolve(res.data.data.id);
    });
  };

  const initFatch = async () => {
    myUserID.value = props.userid;
    if (!props.userid || props.userid === 'false') {
      myUserID.value = await getUserId(address.value);
    }
    await axios
      .get(
        `/api/dealerHxLog/getAllLog?id=${myUserID.value}&size=${
          pagination.value.pageSize
        }&current=${1}`
      )
      .then((res: any) => {
        if (res.data) {
          useDate.value = childPush(res.data.records);
          pagination.value.total = res.data.total;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const syncLoading: any = ref(false);
  const shareLoading: any = ref(false);
  const syncFun = (hx: string) => {
    if (!syncLoading.value) {
      syncLoading.value = true;
      Message.loading({
        content: 'Loading...',
        duration: 1500,
      });
    } else return;
    axios
      .post(`/nftapi/transaction/syncRecord?hx=${hx}&chainId=56`)
      .then((res: any) => {
        // eslint-disable-next-line eqeqeq
        if (res.data == 1) {
          Message.success(t('beiz.success'));
        } else {
          Message.error(t('beiz.error'));
        }
      })
      .finally(() => {
        syncLoading.value = false;
      });
  };

  const shareFun = async (record: any) => {
    if (!shareLoading.value) {
      shareLoading.value = true;
      Message.loading({
        content: 'Loading...',
        duration: 1500,
      });
    } else return;
    await axios
      .post(
        `/api/business/subcommission?amount=${record.amount}&invCode=${record.invCode}&hx=${record.hash}`
      )
      .then((res: any) => {
        // eslint-disable-next-line eqeqeq
        if (res.data == 1) {
          Message.success(t('beiz.success'));
        } else {
          Message.error(t('beiz.error'));
        }
        initFatch();
      })
      .finally(() => {
        shareLoading.value = false;
      });
  };

  watch(
    () => props.userid,
    (newV, oldV) => {
      if (newV) initFatch();
    },
    { immediate: true, deep: true }
  );

  onMounted(() => {
    address.value = localStorage.getItem('address');
  });
</script>

<style scoped lang="less">
  :deep(.arco-table .arco-table-cell) {
    word-break: break-word;
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
  }
</style>
