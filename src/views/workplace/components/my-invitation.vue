<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="24">
      <div class="wrapper">
        <div :style="{ display: 'flex' }">
          <div class="left">
            <a-avatar class="col-avatar">
              <img
                alt="avatar"
                src="//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png"
              />
            </a-avatar>
            <div class="username">
              <span v-show="!switchInput">{{ editInfo.oldName }}</span>
              <input v-show="switchInput" v-model="editInfo.inputName" class="nameInput" type="text" @blur="editName(1)">
              <icon-pen-fill v-show="!switchInput" class="name-edit" @click="editName(1)"/>
            </div>
            <div class="btnGroup">
              <a-button
                :class="levels == 9 ? 'active' : ''"
                @click="changeItem(9)"
                >{{ $t('agent.level5') }}</a-button>
              <a-button
                v-if="level >= 3 && subLevel < 8"
                :class="levels == 4 ? 'active' : ''"
                @click="changeItem(4)"
                >{{ $t('agent.level2') }}</a-button>
                <!-- >{{ $t('agent.level2') + ( subLevel != -1 ? '-'+ (subLevel+1) : '') }}</a-button> -->
              <a-button
                v-if="level >= 3"
                :class="levels == 3 ? 'active' : ''"
                @click="changeItem(3)"
                >{{ $t('agent.level3') }}</a-button>
              <a-button
                v-if="level >= 2"
                :class="levels == 2 ? 'active' : ''"
                @click="changeItem(2)"
                >{{ $t('agent.level4') }}</a-button>
            </div>
          </div>
          <a-card
            class="my-card"
            hoverable
          >
            <template #title>
              <div class="me">{{ $t('workplace.me') }} : {{ address }}</div>
              <div class="my-card-title">
                <a-button type="outline" size="mini" style="min-width: 72px;height: 18px; line-height: 16px">
                  <!-- {{ $t(userLevel) + (subLevel >= 1 ? '-'+subLevel : '') }} -->
                  {{ $t(userLevel) }}
                </a-button>
                <a-button v-if="level != 4" type="primary" size="mini" style="min-width: 72px;height: 18px; line-height: 16px; margin-left: 12px;" @click="upVisible = true">{{ $t('agent.upgrade') }}</a-button>
                <!-- <div class="useremail">
                  <span v-show="!switchInput2">{{ editInfo.oldEmail }}</span>
                  <input v-show="switchInput2" v-model="editInfo.inputEmail" class="emailInput" type="text" :placeholder="editInfo.oldEmail" @blur="editName(2)">
                  <icon-pen-fill class="email-edit" @click="editName(2)"/>
                </div> -->
              </div>
            </template>
            <template #extra>
              <div v-if="level >= 2" class="code-group">
                <div class="code">
                  <a-button type="outline" size="mini" @click="changeCode()">{{ $t(btnContent) }}</a-button>
                </div>
                <div class="link">
                  <a
                    :href="`https://node.aof.games?code=` + curCode"
                    target="view_window"
                    >https://node.aof.games?code={{ curCode }}</a
                  >
                </div>
              </div>
            </template>
            <div>
              <div class="subtitle">
                <div class="total-left">
                  <div v-if="level == 4">{{ $t('agent.level2') }} : <span>{{ totalInfo.level3count }}</span></div>
                  <div v-if="level >= 3">{{ $t('agent.level3') }} : <span>{{ totalInfo.level2count }}</span></div>
                  <div v-if="level >= 2">{{ $t('agent.level4') }} : <span>{{ totalInfo.level1count }}</span></div>
                </div>
                <div class="hash">
                  <div>{{ $t('workplace.total') }}: <span style="margin-right: 20px;">{{ totalInfo.total === -1 ? 0 : totalInfo.total }}</span></div>
                  <div>{{ $t('workplace.hashrate') }}: <span style="margin-right: 20px;">{{ totalInfo.hash }}</span></div>
                  <div>{{ $t('workplace.totalhashrate') }}: <span>{{ Number(totalInfo.hash) * perCalculate }}</span></div>
                </div>
              </div>
              <!-- 我邀请用户信息 -->
              <a-table
                column-resizable
                :bordered="{ cell: true }"
                :data="useDate"
                :stripe="true"
                :loading="loading"
                :pagination="pagination" 
                @page-change="onPageChange"
              >
                <template #columns>
                  <a-table-column :title="$t('workplace.table.online')">
                    <template #cell="{ record }">
                      <img
                        v-show="record.connectWallet == true"
                        src="@/assets/images/online1.png"
                        alt=""
                        sizes="20"
                      />
                    </template>
                  </a-table-column>
                  <a-table-column
                    :title="$t('workplace.table.email')"
                    data-index="email"
                  />
                  <a-table-column
                    :title="$t('workplace.table.nickname')"
                  >
                    <template #cell="{ record }">
                      {{ record.nickname }}
                    </template>
                  </a-table-column>
                  <a-table-column
                    :title="$t('workplace.table.address')"
                  >
                    <template #cell="{ record }">
                      {{ record.addr ? record.addr : $t('workplace.table.nodata') }}
                    </template>
                  </a-table-column>
                  <!-- <a-table-column
                    :title="$t('workplace.table.download')"
                    data-index="download"
                  /> -->
                  <a-table-column
                    :title="$t('workplace.table.ontime')"
                    data-index="duration"
                  />
                  <!-- <a-table-column
                    :title="$t('workplace.table.game')"
                    data-index="gametime"
                  /> -->
                  <a-table-column
                    :title="$t('workplace.table.balance')"
                    data-index="balance"
                  />
                  <a-table-column
                    :title="$t('workplace.table.date')"
                    data-index="createTime"
                  />
                  <a-table-column
                    :title="$t('workplace.table.hashrate')"
                  >
                    <template #cell="{ record }">
                        {{ perCalculate >= 0 ? Number(record.hashrate) * perCalculate : '--' }}
                      </template>
                  </a-table-column>
                  <a-table-column
                    :title="$t('workplace.table.beiz')"
                  >
                    <template #cell="{ record }">
                      {{record.remarks}}
                      <icon-pen-fill v-if="levels !== 9" class="remarks-edit" @click="editRemarks(record.email, record.level)"/>
                    </template>
                  </a-table-column>
                  <!-- <a-table-column :title="$t('agent.table.action')">
                    <template #cell="{ record }">
                      <div class="actionBtn">
                        <a-button 
                          disabled
                          type="outline" 
                          size="mini"
                          class="disable" 
                          @click="setDisable(record)"
                        >
                          {{ $t('workplace.table.disable') }}
                        </a-button>
                      </div>
                    </template>
                  </a-table-column> -->
                </template>
              </a-table>
            </div>
          </a-card>
        </div>
      </div>
    </a-grid-item>

    <!-- disable -->
    <a-modal
      v-model:visible="disVisible"
      :title="$t('workplace.modal.title')"
      class="disModal"
      :cancel-text="$t('login.modal.cancel2')"
      :ok-text="$t('login.modal.ok2')"
      :unmount-on-close="true"
      @cancel="disCancel"
      @ok="disMember"
    >
      <div class="drop">
        <!-- {{ $t('workplace.modal.msg') }} -->
        <span class="addr" style="font-weight: bold">
          {{ address }}
        </span>
        <a-select 
          :model-value="selectVal"
          :style="{width:'320px'}" 
          :placeholder="$t('workplace.modal.place')" 
          @change="handleSelect"
        >
          <a-option>{{ $t('workplace.modal.date1') }}</a-option>
          <a-option>{{ $t('workplace.modal.date2') }}</a-option>
          <a-option>{{ $t('workplace.modal.date3') }}</a-option>
          <a-option>{{ $t('workplace.modal.date4') }}</a-option>
          <a-option>{{ $t('workplace.modal.date5') }}</a-option>
        </a-select>
      </div>
    </a-modal>

    <!-- edit remarks -->
    <a-modal
      v-model:visible="editVisible"
      simple
      :cancel-text="$t('login.modal.cancel2')"
      :ok-text="$t('login.modal.ok2')"
      :unmount-on-close="true"
      @cancel="editCancel"
      @ok="okRemarks"
    >
      <a-form :model="remarkInfo.val">
        <a-form-item 
          field="remarks" 
          :rules="[{maxLength: 20, message: $t('workplace.table.beiz.msg')}]"
        >
          <a-input v-model="remarkInfo.val.remarks" onfocus />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- up grade -->
    <UpGrade :visible="upVisible" @cancelup="upGradeRes"/>
  </a-grid>
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive, onActivated } from 'vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { computedDur, vertDate } from '@/utils/computed'
  import { Message } from '@arco-design/web-vue';
  import { staticData } from '@/store';
  import { storeToRefs } from 'pinia';
  import Cookies from 'js-cookie'
  import UpGrade from './upgrade.vue'

  const comStore = staticData();
  const { menuHidden } = storeToRefs(comStore);
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const upVisible = ref<boolean>(false)
  const address: any = ref('');
  const email: any = ref('');
  const inCode: any = ref({}); // 最多存放三个邀请码
  const curCode: any = ref('');
  const levels: any = ref(4);
  const useDate = ref([]);
  const myUseDate: any = ref([]);
  const treeDataL2: any = ref([]);
  const treeDataL3: any = ref([]);
  const treeDataL4: any = ref([]);
  const btnContent: any = ref('workplace.code1')
  const level: any = ref('1')
  const subLevel: any = ref(-1)
  const userLevel: any = ref('workplace.level')
  const disVisible = ref(false);
  const editVisible = ref(false);
  const selectVal = ref('');
  const toAddress: any = ref('');
  const toLevel: any = ref('');
  const remarksActive: any = ref(false);
  const switchInput: any = ref(false); // nickname
  const switchInput2: any = ref(false); // email
  const editInfo: any = ref({
    oldName: '',
    inputName: '',
    oldEmail: '',
    inputEmail: ''
  });
  const remarkInfo = reactive({
    val: {
      remarks: ''
    },
  });
  const totalInfo: any = ref({
    level3count: 0,
    level2count: 0,
    level1count: 0,
    total: -1, // 总人数
    hash: 0, // 总算力
  });
  const pagination: any = ref({
    type: 'pagination',
    page: 50,
    current: 1,
    pageSize: 10,
  });


  // switch code
  const changeCode = () =>{
    // eslint-disable-next-line eqeqeq
    if( inCode.value.partnerCode && ( curCode.value == inCode.value.userCode ) ){
      curCode.value = inCode.value.partnerCode;
      btnContent.value = 'workplace.code2';
      // eslint-disable-next-line eqeqeq
    }else if( inCode.value.userCode && ( curCode.value == inCode.value.partnerCode ) ){
      curCode.value = inCode.value.userCode;
      btnContent.value = 'workplace.code1';
    }
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
    } else if (type === 9) {
      useDate.value = myUseDate.value;
    }
  };

  // push children
  const childPush = (result: any, editNameFlag?: any) => {
    const lenL = result.length;
    const children: any = []; 
    for (let i = 0; i < lenL; i += 1) {
      children.push({
        key: result[i].id,
        connectWallet: result[i].connectWallet,
        nickname: result[i].nikename,
        addr: result[i].address,
        email: result[i].email,
        download: Number(result[i].download) ? 'true' : 'false',
        duration:
          result[i].onlineTime > 86400
            ? t('workplace.table.offline')
            : computedDur(result[i].onlineTime),
        gametime: result[i].gameTime > 86400
              ? t('workplace.table.offline')
              : computedDur(result[i].gameTime),
        balance: result[i].fujiCoin ? result[i].fujiCoin : 0,
        createTime: result[i].createTime ? vertDate(result[i].createTime) : 'null',
        hashrate: result[i].hashrate,
        remarks: result[i].remarks === 'cyber_user'? '': result[i].remarks,
        level: result[i].level,
      });
      // 当修改昵称时，children不进行总数、算力计算
      if(!editNameFlag) totalInfo.value.hash += Number(result[i].hashrate);
    }
    
    if(!editNameFlag) totalInfo.value.total += lenL;
    return children
  }

  // init data
  const getMyInvit = async (toL?: any) => {
    useDate.value = [];
    treeDataL2.value = [];
    treeDataL3.value = [];
    treeDataL4.value = [];
    levels.value = 4;
    userLevel.value = 'workplace.level';
    setLoading(true);
    totalInfo.value = {
      level3count: 0,
      level2count: 0,
      level1count: 0,
      total: -1, 
      hash: 0,
    };
    if (address.value) {
      await axios.get(`/api/user/getdata?email=${email.value}`)
        .then((res: any) => {
          if (res.data.code === 200) {
            const result = res.data.data;
            inCode.value.quyuCode = result.OneClass ? result.OneClass : '';
            inCode.value.partnerCode = result.twoClass ? result.twoClass : '';
            inCode.value.userCode = result.threeClass;
            curCode.value = result.threeClass;
            btnContent.value = 'workplace.code1';
            if( result.level3 ){
              totalInfo.value.level3count = result.level3.length;
              const children2 = childPush( result.level3 );
              treeDataL2.value.push(...children2)
            }
            if( result.level2 ){
              totalInfo.value.level2count = result.level2.length;
              const children3 = childPush( result.level2 );
              treeDataL3.value.push(...children3)
            }
            if( result.level1 ){
              totalInfo.value.level1count = result.level1.length;
              const children4 = childPush( result.level1 );
              treeDataL4.value.push(...children4)
            }

            if( toL ){  // 保存修改备注时的浏览位置
              if( toL === '3'){
                useDate.value = treeDataL2.value;
                levels.value = 4;
                userLevel.value = 'agent.level1'
              }else if( toL === '2' ){
                useDate.value = treeDataL3.value;
                levels.value = 3;
                userLevel.value = 'agent.level2'
              }else{
                useDate.value = treeDataL4.value;
                levels.value = 2;
                userLevel.value = 'agent.level3'
              }
            // eslint-disable-next-line eqeqeq
            } else if( toL == undefined ){
              // eslint-disable-next-line eqeqeq
              if( level.value == 4 ){
                useDate.value = treeDataL2.value
              // eslint-disable-next-line eqeqeq
              }else if( level.value == 3 ){
                if( subLevel.value < 8 ){  // 1-7区域
                  useDate.value = treeDataL2.value
                }else{ // 8-区域
                  useDate.value = treeDataL3.value
                }
              // eslint-disable-next-line eqeqeq
              }else if( level.value == 2 ){
                useDate.value = treeDataL4.value;
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

  // disable
  const disAddress: any = ref('');
  const setDisable = (info: any) => {
    disVisible.value = true;
    disAddress.value = info.addr;
  }
  const disCancel = () => {
    disVisible.value = false;
    selectVal.value = '';
  }
  const handleSelect = (v: any) => {
    selectVal.value = v;
  };
  const disMember = () => {
    // console.log(disAddress.value, selectVal.value);
  }
  // edit remarks
  const editRemarks = (toE: any, toL: any) => {
    editVisible.value = true;
    toAddress.value = toE;
    toLevel.value = toL; // 存储修改备注时的等级
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
          getMyInvit(toLevel.value); // 刷新显示当前修改位置信息
          // eslint-disable-next-line no-use-before-define
          getHashrate();
        }else {
          Message.error(t('beiz.error'))
        }
        remarkInfo.val.remarks = ''
      })
  };
  const editName = (type: any) => {
    if( type === 1 ){ // 修改昵称
      if( !switchInput.value ){
        switchInput.value = !switchInput.value;
        return
      }
      // 判断当填写完、填写值和原名称不等、填写值不为空时，发送请求
      if( switchInput.value && (editInfo.value.inputName !== editInfo.value.oldName) && editInfo.value.inputName){
        axios
          .put(`/api/user/nickname?email=${email.value}&nikename=${editInfo.value.inputName}`)
          .then((res: any) => {
            if ( res.data.code === 200 && res.data.data ) {
              switchInput.value = !switchInput.value;
              Message.success(t('beiz.success'))
              editInfo.value.oldName = editInfo.value.inputName;
              editInfo.value.inputName = '';
              // eslint-disable-next-line no-use-before-define
              getHashrate(1);
            }else {
              Message.error(t('beiz.error'))
            }
          })
      }else{
        switchInput.value = !switchInput.value;
      }
    }else{  // 修改邮箱
      if( !switchInput2.value ){
        switchInput2.value = !switchInput2.value;
        return
      }
      // 判断当填写完、填写值和原名称不等、填写值不为空时，发送请求
      if( switchInput2.value && (editInfo.value.inputEmail !== editInfo.value.oldEmail) && editInfo.value.inputEmail){
        axios
          .put(`/api/user/nickname?email=${email.value}&nikename=${editInfo.value.inputEmail}`)
          .then((res: any) => {
            if ( res.data.code === 200 && res.data.data ) {
              switchInput2.value = !switchInput2.value;
              Message.success(t('beiz.success'))
              editInfo.value.oldEmail = editInfo.value.inputEmail;
              editInfo.value.inputEmail = '';
              // eslint-disable-next-line no-use-before-define
              getHashrate(1);
            }else {
              Message.error(t('beiz.error'))
            }
          })
      }else{
        switchInput2.value = !switchInput2.value;
      }
    }
  }


  // 获取算力
  const perCalculate = ref<number>(-1)
  const getHashrate = async (editNameFlag?: any) => {
    axios.get('/api/connection/calculateTotalForce').then((res: any) => {
      if( res.status === 200 ){
        perCalculate.value = Number(res.data['personal calculate'])*10000000
      }
    })
    await axios.get(`/api/user/getuser?address=${address.value}`)
      .then((res: any) => {
        if ( res.data.code === 200 && res.data.data ) {
          editInfo.value.oldName = res.data.data.nikename;
          // editInfo.value.oldEmail = res.data.data.email;
          subLevel.value = Number(res.data.data.SubLevel)
          // eslint-disable-next-line eqeqeq
          if( level.value == 4 ){
            levels.value = 4;
            userLevel.value = 'agent.level1'
          // eslint-disable-next-line eqeqeq
          }else if( level.value == 3 ){
            if( subLevel.value < 8 ){  // 1-7区域
              levels.value = 4;
              userLevel.value = 'agent.level2'
            }else{ // 8-区域
              levels.value = 3;
              userLevel.value = 'agent.level2'
            }
          // eslint-disable-next-line eqeqeq
          }else if( level.value == 2 ){
            levels.value = 2;
            userLevel.value = 'agent.level3'
          }else{
            levels.value = 9;
            userLevel.value = 'agent.level4'
          }
          const tempArr = []
          tempArr.push(res.data.data)
          myUseDate.value = childPush( tempArr,editNameFlag); // 当修改昵称时，children不进行总数、算力计算
          if (levels.value === 9) { // 如果当前浏览我的信息，修改昵称后刷新数据
            useDate.value = myUseDate.value;
          }
        }
      })
  }

  // 升级组件
  const upGradeRes = (bol: boolean,succ?: boolean) => {
    upVisible.value = bol
    console.log(succ);
    if( succ ) {
      console.log(1);
      axios
      .get(`/api/user/doLogin?address=${address.value}`)
      .then((res: any) => {
        if (res.data.code === 200 && res.data.data[1]) {
          menuHidden.value = res.data.data[0].level
          level.value = res.data.data[0].level
          localStorage.setItem('userLl', res.data.data[0].level);
          localStorage.setItem('userEm', res.data.data[0].email);
          Cookies.set('user_login_com', JSON.stringify({satoken: Cookies.get('satoken'),email:res.data.data[0].email,address: res.data.data[0].address,level: res.data.data[0].level}), { expires: 30, path: '', domain: 'aof.games' })
        }
      });
      getHashrate();
      getMyInvit();
    }
  }

  onMounted(() => {
    address.value = localStorage.getItem('address');
    email.value = localStorage.getItem('userEm');
    level.value = localStorage.getItem('userLl') ? localStorage.getItem('userLl') : '1';
    getHashrate();
    getMyInvit();
  });

  onActivated(() => {
    if( remarksActive.value ){
      getHashrate();
      getMyInvit(); // 进入页面局部刷新数据
    }
  })

</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }

  .wrapper {
    width: 100%;
    .left{
      display: flex;
      flex-direction: column;
      align-items: center;
      .username {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 112px;
        margin: 14px auto 15px;
        color: var(--color-text-1);
        font-size: 14px;
        font-weight: bold;
        span {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
        }
        .nameInput {
          width: 90px;
          border: none;
          border-bottom: 1px solid #ccc;
          text-align: center;
          color: var(--color-text-1);
          font-size: 14px;
          font-weight: bold;
          outline: none;
        }
        .name-edit {
          width: 22px;
          min-width: 22px;
          color: #165dff;
          font-size: 22px !important;
          cursor: pointer;
        }
      }
      .btnGroup {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        // margin-top: 50px; // 
        button{
          margin-bottom: 10px;
          border-radius: 6px;
        }
      }
      .active {
        color: #fff;
        background: #165dff;
      }
    }
    .my-card {
      width: 100%;
      border: none !important;
      padding-right: 20px;
      :deep(.arco-card-header){
        height: 56px;
      }
      &-title {
        display: flex;
        align-items: center;
        margin-top: 6px;
        overflow: hidden;
        .useremail {
          display: flex;
          align-items: center;
          margin-left: 14px;
          color: var(--color-text-1);
          font-size: 14px;
          .emailInput {
            width: 150px;
            border: none;
            border-bottom: 1px solid #ccc;
            color: var(--color-text-1);
            font-size: 14px;
            outline: none;
          }
          .email-edit {
            width: 22px;
            min-width: 22px;
            color: #165dff;
            font-size: 20px !important;
            cursor: pointer;
          }
        }
      }
      .code-group {
        overflow: hidden;
        text-align: right;
        .code {
            button {
              font-size: 14px;
            }
        }

        .link {
          margin-top: 10px;
          text-align: right;
          a {
            color: rgb(var(--primary-6));
            text-decoration: none;
            cursor: pointer;
          }

          a:hover {
            color: blue;
          }
        }
      }

      .subtitle {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;
        .total-left {
          display: flex;
          div{
            margin-right: 20px;
          }
        }

        .total-left,
        .hash {
          display: flex;
          span {
            color: red;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }

      .partners {
        margin-bottom: 4px;
        padding: 0 8px;
        background: rgb(var(--gray-2));
        cursor: pointer;

        span:first-child {
          width: 20%;
          margin-right: 20px;
        }

        span:last-child {
          word-break: break-all;
        }

        span {
          display: inline-block;
          padding: 10px 0;
          color: rgb(var(--gray-8));
          font-size: 16px;
        }

        &:hover {
          background: rgb(var(--gray-1));
        }
      }

      &:hover {
        box-shadow: none;
      }
    }
  }

  .col-avatar {
    width: 52px !important;
    height: 50px !important;
    background-color: var(--color-fill-2);
  }

  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
  :deep(.arco-card-body) {
    .nickname{
      width: 80px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .arco-table-td:nth-child(2),.arco-table-td:nth-child(3), .arco-table-td:nth-child(5), .arco-table-td:nth-child(6),.arco-table-td:nth-child(7) {
      .arco-table-cell {
        white-space: nowrap;
      }
    }
    .arco-table-td:nth-child(4) {
      .arco-table-cell {
        width: 220px;
      }
    }
    .arco-table-td:nth-child(8),.arco-table-td:nth-child(9),.arco-table-td:nth-child(11) {
      .arco-table-cell {
        width: 120px;
      }
    }
    .remarks-edit {
      float: right;
      color: #165dff;
      font-size: 22px !important;
      cursor: pointer;
    }
  }
  .drop{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .addr {
      margin-bottom: 20px;
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
    .panel-col {
      padding-left: 0;
    }
    .subtitle {
      flex-direction: column;
      .total-left {
        font-size: 14px;
        white-space: nowrap;
        div{
          margin-bottom: 4px;
        }
      }
      .hash {
        font-size: 14px;
      }
    }

    .wrapper {
      .left{
        .btnGroup{
          margin-top: 29px;
        }
      }
      :deep(.arco-card-header) {
        flex-direction: column !important;
        width: 410px;
        height: auto !important;

        .arco-card-header-title {
          width: 80%;
          margin-bottom: 16px;
          white-space: pre-wrap;
          word-break: break-all;
          text-align: center;
        }
        .my-card-title {
          justify-content: center;
        }

        .code-group {
          text-align: center !important;

          a {
            white-space: nowrap;
          }
        }
      }

      :deep(.arco-card-body) {
        width: 410px;
        padding: 16px 20px 16px 10px;
      }
    }

    .col-avatar {
      margin-top: 85px;
    }
  }

  @media (max-width: @screen-sm) {
    .my-card {
      :deep(.arco-card-header){
        .me {
          width: auto;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
  @media (max-width: @screen-md) and (min-width: @screen-sm) {
    .my-card {
      :deep(.arco-card-header){
        .me {
          width: 380px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }


</style>
