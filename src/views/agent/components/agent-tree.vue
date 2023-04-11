<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="24">
      <div class="title">{{ $t('agent.title') }}</div>
      <div class="content">
        <a-space class="btnGroup">
          <div>
            <a-button
              v-if="level >= 3 && subLevel < 8"
              :class="levels == 4 ? 'active' : ''"
              @click="changeItem(4)"
              >
              {{ $t('agent.level2') }}
              <!-- {{ $t('agent.level2')+ ( subLevel != -1 ? '('+ (subLevel+1)+' Level)' : '' ) }} -->
              </a-button
            >
            <a-button
              v-if="level >= 3"
              :class="levels == 3 ? 'active' : ''"
              @click="changeItem(3)"
              >{{ $t('agent.level3') }}</a-button
            >
            <!-- <a-button
              v-if="level >= 2"
              :class="levels == 2 ? 'active' : ''"
              @click="changeItem(2)"
              >{{ $t('agent.level4') }}</a-button
            > -->
          </div>
          <div>
            <a-button 
              disabled
              type="outline" 
              size="small"
              class="addbtn" 
              @click="addInfo()"
            >
              {{ $t('agent.btn.add') }}
            </a-button>
          </div>
        </a-space>
        <div class="card">
          <a-spin :loading="loading" style="display: block">
            <a-table 
              class="tree"
              column-resizable
              :scroll="{x: 800,y: 540}"
              :load-more="moretable"
              :data="useDate" 
              :loading="loading"
              :pagination="pagination"
              @page-change="onPageChange"
            >
              <template #columns>
                  <a-table-column
                    width="220"
                    :title="$t('workplace.table.email')"
                    data-index="email"
                  />
                  <a-table-column
                    width="162"
                    :title="$t('agent.total')"
                    data-index="total"
                  >
                  <template #cell="{ record }">
                      <div v-if="record.countlevel3">
                        {{ $t('agent.level2') }}
                        <!-- {{ $t('agent.level2') + '('+(Number(record.subLevel)+1)+'Level)' }} : {{ record.countlevel3 }} -->
                      </div>
                      <div v-if="record.countlevel2">{{ $t('agent.level3') }} : {{ record.countlevel2 }}</div>
                      <div v-if="record.countlevel1">{{ $t('agent.level4') }} : {{ record.countlevel1 }}</div>
                      <div v-if="!record.countlevel3 && !record.countlevel2 && !record.countlevel1">{{ $t('workplace.table.nodata') }}</div>
                    </template>
                  </a-table-column>
                  <a-table-column
                    width="80"
                    :title="$t('workplace.table.nickname')"
                  >
                    <template #cell="{ record }">
                      {{record.nickname ? record.nickname : 'null'}}
                    </template>
                  </a-table-column>
                  <a-table-column
                    width="220"
                    :title="$t('workplace.table.address')"
                  >
                    <template #cell="{ record }">
                      {{ record.addr ? record.addr : $t('workplace.table.nodata') }}
                    </template>
                  </a-table-column>
                  <a-table-column
                    width="70"
                    :title="$t('workplace.table.download')"
                    data-index="download"
                  />
                  <a-table-column
                    width="130"
                    :title="$t('workplace.table.ontime')"
                    data-index="duration"
                  />
                  <a-table-column
                    width="130"
                    :title="$t('workplace.table.game')"
                    data-index="gametime"
                  />
                  <a-table-column
                    width="60"
                    :title="$t('workplace.table.balance')"
                    data-index="balance"
                  />
                  <a-table-column
                    width="120"
                    :title="$t('workplace.table.date')"
                    data-index="createTime"
                  />
                  <a-table-column
                    width="100"
                    :title="$t('workplace.table.hashrate')"
                    data-index="hashrate"
                  />
                  <a-table-column
                    width="120"
                    :title="$t('workplace.table.beiz')"
                  >
                    <template #cell="{ record }">
                      {{record.remarks}}
                      <icon-pen-fill v-if="!record.loadEdit" class="remarks-edit" @click="editRemarks(record.email, record.level)"/>
                    </template>
                  </a-table-column>
                  <!-- <a-table-column 
                    width="80"
                    :title="$t('agent.table.action')"
                  >
                    <template #cell="{ record }">
                      <div class="actionBtn">
                        <a-button
                          disabled
                          type="outline"
                          size="mini"
                          status="danger"
                          class="delbtn"
                          @click="deletekWarning(record)"
                          >
                          {{ $t('agent.btn.del') }}
                        </a-button>
                      </div>
                    </template>
                  </a-table-column> -->
                </template>
            </a-table>
          </a-spin>
        </div>
      </div>
      <!-- edit remarks -->
      <a-modal
        v-model:visible="editVisible"
        simple
        :cancel-text="$t('login.modal.cancel2')"
        :ok-text="$t('login.modal.ok2')"
        @cancel="editCancel"
        @ok="okRemarks"
      >
        <a-form :model="remarkInfo.val">
          <a-form-item 
            field="remarks" 
            :rules="[{maxLength: 20, message: $t('workplace.table.beiz.msg')}]"
          >
            <a-input v-model="remarkInfo.val.remarks" />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- del -->
      <a-modal
        v-model:visible="delVisible"
        simple
        :cancel-text="$t('login.modal.cancel2')"
        :ok-text="$t('login.modal.ok2')"
        @cancel="delCancel"
        @ok="deleteMember"
      >
        <template #title>
          <icon-exclamation-circle-fill />
          {{ $t('agent.delModal.title') }}
        </template>
        <div>{{ $t('agent.delModal.msg') }}</div>
      </a-modal>

      <!-- add -->
      <a-modal
        v-model:visible="addVisible"
        :title="$t('agent.addModal.title')"
        class="addModal"
        :cancel-text="$t('login.modal.cancel2')"
        :ok-text="$t('login.modal.ok2')"
        @cancel="addCancel"
        @ok="addMember"
      >
        <div style="margin: 0 0 16px 40px"
          >{{ $t('agent.btn.addto') }}
          <span style="padding-left: 16px; font-weight: bold">
            {{ addForm.val.parNode.addr }}
          </span></div
        >
        <a-form :model="addForm.val">
          <a-form-item field="name" :label="$t('agent.addModal.label')">
            <a-input v-model="addForm.val.address" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, onActivated } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import { computedDur, vertDate } from '@/utils/computed'

  // request
  // import { addTableDate } from '@/views/agent/request';
  import { Message } from '@arco-design/web-vue';
  // import { useRouter } from 'vue-router';
  // const router = useRouter();
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const address: any = ref('');
  const email: any = ref('');
  const useDate = ref([]);
  const treeDataL2: any = ref([]);
  const treeDataL3: any = ref([]);
  const treeDataL4: any = ref([]);
  const levels = ref(4);
  const delVisible = ref(false);
  const addVisible = ref(false);
  const currentNode: any = [];
  const level: any = ref('1')
  const isLeaf: any = ref(false);
  const editVisible = ref(false);
  const toAddress: any = ref('');
  const toLevel: any = ref('');
  const remarksActive: any = ref(false);
  const pagination: any = ref({
    type: 'pagination',
    page: 50,
    current: 1,
    pageSize: 10,
  });
  const remarkInfo = reactive({
    val: {
      remarks: ''
    },
  });
  const addForm = reactive({
    val: {
      address: '',
      parNode: {
        addr: ''
      },
    },
  });

  // push children
  const childPush = (resultL: any, loade: any) => {
      const lenL = resultL.length;
      const children: any = []; 
      for (let i = 0; i < lenL; i += 1) {
        children.push({
          key: resultL[i].id,
          connectWallet: resultL[i].connectWallet,
          nickname: resultL[i].nikename,
          addr: resultL[i].address,
          email: resultL[i].email,
          countlevel1: Number(resultL[i].level1),
          countlevel2: Number(resultL[i].level2),
          countlevel3: Number(resultL[i].level3),
          download: Number(resultL[i].download) ? 'true' : 'false',
          duration:
            resultL[i].onlineTime > 86400
              ? t('workplace.table.offline')
              : computedDur(resultL[i].onlineTime),
          gametime: resultL[i].gameTime > 86400
              ? t('workplace.table.offline')
              : computedDur(resultL[i].gameTime),
          balance: resultL[i].fujiCoin ? resultL[i].fujiCoin : 0,
          createTime: resultL[i].createTime ? vertDate(resultL[i].createTime) : 'null',
          hashrate: resultL[i].hashrate,
          remarks: resultL[i].remarks ? resultL[i].remarks : 'Cyber user',
          level: resultL[i].level,
          subLevel: resultL[i].SubLevel,
          isLeaf: isLeaf.value,
          loadEdit: loade,
        });
      }
      return children
  }

  // load more
  const moretable = (record: any, done: any) => {
    axios
      .get(`/api/user/getdata?email=${record.email}`)
      .then((res: any) => {
        if (res.data.code === 200) {
            const result = res.data.data;
            // eslint-disable-next-line eqeqeq
            if( record.level == 3 ){
              const children: any = ref([]);
              if( result.level3 ){
                isLeaf.value = false;
                const childrenTemp3: any = childPush(result.level3, true);
                children.value.push(...childrenTemp3)
              }
              if( result.level2 ){
                isLeaf.value = false;
                const childrenTemp2: any = childPush(result.level2, true);
                children.value.push(...childrenTemp2)
              }
              if( result.level1 ){
                isLeaf.value = true;
                const childrentemp1: any = childPush(result.level1, true);
                children.value.push(...childrentemp1)
              }
              done(children.value);
            // eslint-disable-next-line eqeqeq
            }else if( record.level == 2 ){
              if( result.level1 ){
                isLeaf.value = true;
                const children = childPush(result.level1, true);
                done(children)
              }else{
                done([]);
              }
            }else{
              done([]);
            }
        }else{
          done([]);
        }
      })
  }

  // pagination
  const onPageChange = async (current: number) => {
    pagination.value.current = current;
  };


  // switch type
  const changeItem = (type: any) => {
    pagination.value.current = 1;
    levels.value = type;
    if (type === 4) {
      useDate.value = treeDataL2.value;
    } else if (type === 3) {
      useDate.value = treeDataL3.value;
    } else if (type === 2) {
      useDate.value = treeDataL4.value;
    }
  };

  // get userinfo - subLevel
  const subLevel: any = ref(-1)
  const getUserInfo = () => {
    axios.get(`/api/user/getuser?address=${address.value}`).then((res: any) => {
      if ( res.data.code === 200 && res.data.data ) {
        subLevel.value = Number(res.data.data.SubLevel)
        // email.value = res.data.data.email
        // level.value = res.data.data.level
      }
    })
  }

  // init data
  const fetchData = async (toL?: any) => {
    useDate.value = [];
    treeDataL2.value = [];
    treeDataL3.value = [];
    treeDataL4.value = [];
    isLeaf.value = false;
    levels.value = 4;
    setLoading(true);
    if (address.value) {
      await axios
        .get(`/api/user/getdata?email=${email.value}`)
        .then((res: any) => {
          if (res.data.code === 200) {
            const result = res.data.data;
            if( result.level3 ){ // 当前用户下的区域代理
              const children2 = childPush(result.level3, false);
              treeDataL2.value.push(...children2)
            }
            if( result.level2 ){ // 当前用户下的伙伴代理
              // isLeaf.value = true;
              const children3 = childPush(result.level2, false);
              treeDataL3.value.push(...children3)
            }
            // if( result.level1 ){ // 当前用户下的C端用户
            //   isLeaf.value = true;
            //   const children4 = childPush(result.level1, false);
            //   treeDataL4.value.push(...children4)
            // }
            if( toL ){ // 保存修改备注时的浏览位置
              if( toL === '3'){
                useDate.value = treeDataL2.value;
                levels.value = 4;
              }else if( toL === '2' ){
                useDate.value = treeDataL3.value;
                levels.value = 3;
              }else{
                useDate.value = treeDataL4.value;
                levels.value = 2;
              }
            // eslint-disable-next-line eqeqeq
            } else if( toL == undefined ){
              // eslint-disable-next-line eqeqeq
              if( level.value == 4){
                useDate.value = treeDataL2.value;
                levels.value = 4;
              // eslint-disable-next-line eqeqeq
              }else if( level.value == 3 && subLevel.value < 8 ){  // 1-7区域
                useDate.value = treeDataL2.value;
                levels.value = 4;
              // eslint-disable-next-line eqeqeq
              }else if( level.value == 3 ){ // 8区域
                useDate.value = treeDataL3.value;
                levels.value = 3;
              // eslint-disable-next-line eqeqeq
              }else if( level.value == 2 ){
                useDate.value = treeDataL4.value;
                levels.value = 2;
              }else{
                levels.value = 1;
              }
            }
          }
        })
        .finally(() => {
          setLoading(false);
          remarksActive.value = true;
        });
    }
  };

  // add
  const addInfo = () => {
    addVisible.value = true;
    addForm.val.parNode.addr = address.value;
    // currentNode = nodeData;
  };
  const addCancel = () => {
    addVisible.value = false;
    addForm.val = {
      address: '',
      parNode: {
        addr: '',
      },
    };
  };

  const addMember = () => {
    // addTableDate().then((res: any) => {
    //   const children = currentNode.children || []
    //   children.push({
    //     key: res.data.id,
    //     connectWallet: res.data.connectWallet,
    //     nickname: res.data.nikename,
    //     addr: res.data.address,
    //     email: res.data.email,
    //     download: res.data.download ? 'true' : 'false',
    //     duration:
    //       res.data.onlineTime > 86400
    //         ? t('workplace.table.offline')
    //         : computedDur(res.data.onlineTime),
    //     balance: res.data.fujiCoin,
    //     gametime: computedDur(res.data.playgametimes),
    //     createTime: vertDate(res.data.createTime),
    //     hashrate: res.data.hashrate,
    //     remarks: res.data.remarks ? res.data.remarks : 'Cyber user',
    //     level: res.data.level,
    //     isLeaf: false,
    //   })
    //   currentNode.children = children
    //   console.log(useDate);
    // });
  };
  // delete
  const deletekWarning = (nodeData: any) => {
    // console.log(nodeData);
    delVisible.value = true;
  };
  const delCancel = () => {
    delVisible.value = false;
  };
  const deleteMember = () => {
    console.log('sure');
    fetchData();
  };

  // edit remarks
  const editRemarks = (toE: any, toL: any) => {
    editVisible.value = true;
    toAddress.value = toE;
    toLevel.value = toL;
  };
  const editCancel = () => {
    editVisible.value = false;
    remarkInfo.val.remarks = ''
  };

  const okRemarks = () => {
    axios
      .put(`/api/re/setremarks?address=${email.value}&toaddress=${toAddress.value}&remarks=${remarkInfo.val.remarks}`)
      .then((res: any) => {
        if ( res.data.code === 200 && res.data.data ) {
          Message.success(t('beiz.success'))
          fetchData(toLevel.value);
        }else {
          Message.error(t('beiz.error'))
        }
        remarkInfo.val.remarks = ''
      })
  };

  onMounted(() => {
    address.value = localStorage.getItem('address');
    email.value = localStorage.getItem('userEm');
    level.value = localStorage.getItem('userLl') ? localStorage.getItem('userLl') : '1';
    getUserInfo()
    fetchData();
  });

  onActivated(() => {
    if( remarksActive.value ){
      fetchData(); // 进入页面局部刷新数据
    }
  })
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

      .btnGroup {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .addbtn:hover {
          background: rgba(64, 128, 255, 0.15);
        }
      }

      .active {
        color: #fff;
        background: #165dff;
      }

      .card {
        padding: 16px;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        &:hover {
          box-shadow: 1px 1px 3px #e5e8ef;
        }

        .tree {
          .actionBtn {
  
            .delbtn:hover {
              background: rgba(247, 101, 96, 0.1);
            }
          }
        }
      }
    }
  }
  :deep(.arco-table-tr) {
    // .arco-table-td:nth-child(10) {
    //   .arco-table-cell {
    //     width: 120px;
    //   }
    // }
    .remarks-edit {
      float: right;
      color: #165dff;
      font-size: 22px !important;
      cursor: pointer;
    }
  }
  :deep(.arco-row-justify-start) {
    justify-content: center;
  }
  :deep(.arco-form-item-label-col) {
    display: none;
  }

</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .card {
      padding: 0 !important;
      :deep(.arco-table-tr) {
        padding: 16px 2px;
      }
    }
    .btnGroup {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .addbtn {
          margin-top: 10px;
        }
    }
  }
</style>
