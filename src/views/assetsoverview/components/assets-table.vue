<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="24">
      <a-card class="my-card" :title="$t('assets.title')" hoverable>
        <div class="select">
          <a-dropdown @select="handleSelect">
            <a-button
              :value="nowNetWork"
              style="width: 100px; margin-bottom: 14px"
              >{{ nowNetWork }}</a-button
            >
            <template #content>
              <a-doption style="width: 100px" :value="{ value: 'Fuji' }"
                >Fuji</a-doption
              >
              <a-doption style="width: 100px" :value="{ value: 'Mumbai' }"
                >Mumbai</a-doption
              >
            </template>
          </a-dropdown>
        </div>
        <a-table
          column-resizable
          :bordered="{ cell: true }"
          :data="contractDate"
          :stripe="false"
          :pagination="false"
        >
          <!-- :pagination="pagination" @page-change="onPageChange" -->
          <template #columns>
            <a-table-column
              :title="$t('assets.table.name')"
              data-index="name"
            />
            <a-table-column class="address" :title="$t('assets.table.address')">
              <template #cell="{ record }">
                <span style="font-size: 13px">{{ record.address }}</span>
              </template>
            </a-table-column>
            <a-table-column
              :title="$t('assets.table.contractName')"
              data-index="contractName"
              width="180"
            />
            <a-table-column :title="$t('assets.table.id')" data-index="id">
              <template #cell="{ record }">
                <div
                  v-if="record.id != -1"
                  class="haveId"
                  style="display: flex; flex-direction: column"
                >
                  <a-button
                    v-for="(item, index) in record.id"
                    :key="index"
                    size="10"
                    >{{ item }}</a-button
                  >
                </div>
                <div v-else class="noId" style="text-align: center">--</div>
              </template>
            </a-table-column>
            <a-table-column :title="$t('assets.table.circulation')">
              <template #cell="{ record }">
                <div
                  v-if="record.circulation != -1"
                  class="haveId"
                  style="display: flex; flex-direction: column"
                >
                  <a-button
                    v-for="(item, index) in record.circulation"
                    :key="index"
                    size="10"
                    >{{ item }}</a-button
                  >
                </div>
                <div v-else class="noId" style="text-align: center">--</div>
              </template>
            </a-table-column>
            <a-table-column :title="$t('assets.table.owner')">
              <template #cell="{ record }">
                <div style="text-align: center">{{ record.owner }}</div>
              </template>
            </a-table-column>
            <a-table-column :title="$t('assets.table.browser')">
              <template #cell="{ record }">
                <a :href="record.browser" class="browser" target="view_window">
                  link
                </a>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  // import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import contracts from '@/utils/contracts';
  import web3J from '@/utils/web3';
  // eslint-disable-next-line import/extensions
  import Web3 from 'web3/dist/web3.min.js'

  // import useLoading from '@/hooks/loading';
  // import axios from 'axios';

  // const { loading, setLoading } = useLoading(true);
  // const router = useRouter();
  const { t } = useI18n();
  const nowNetWork = ref('Fuji');
  const fujiGame: any = ref([]);
  const fujiRole: any = ref([]);
  const fujiHead: any = ref([]);
  const fujiBadge: any = ref([]);
  const mumbaiGame: any = ref([]);
  const mumbaiRole: any = ref([]);
  const mumbaiHead: any = ref([]);
  const circFlaFuji: any = ref(0);
  const circFlagMum: any = ref(0);
  // const pagination: any = ref({
  //   startPage: 1,
  //   size: '2',
  //   total: 10,
  // });

  const contractDate = ref([
    {
      name: t('assets.table.column1_1'),
      address: '0xD4c27B5A5c15B1524FC909F0FE0d191C4e893695',
      contractName: 'CyberPop Game',
      id: [0, 2],
      circulation: fujiGame,
      owner: '--',
      browser:
        'https://testnet.snowtrace.io/token/0xD4c27B5A5c15B1524FC909F0FE0d191C4e893695',
    },
    {
      name: t('assets.table.column1_2'),
      address: '0x78F66E37e9fE077d2F0126E3a26e6FB0D14F2BB0',
      contractName: 'CyberPop Cyborg',
      id: -1,
      circulation: fujiRole,
      owner: '--',
      browser:
        'https://testnet.snowtrace.io/token/0x78F66E37e9fE077d2F0126E3a26e6FB0D14F2BB0',
    },
    {
      name: t('assets.table.column1_3'),
      address: '0x4B4cbe55125B48e868AA68E08b7527524C46E8AC',
      contractName: 'CyberPop CyberClub',
      id: -1,
      circulation: fujiHead,
      owner: '--',
      browser:
        'https://testnet.snowtrace.io/token/0x4B4cbe55125B48e868AA68E08b7527524C46E8AC',
    },
    {
      name: t('assets.table.column1_4'),
      address: '0x55eFD6D4cF31F925E36d268C12353848c9e782fD',
      contractName: 'CyberPop Loot Box',
      id: [0, 1, 2],
      circulation: -1,
      owner: '--',
      browser:
        'https://testnet.snowtrace.io/token/0x55eFD6D4cF31F925E36d268C12353848c9e782fD',
    },
    {
      name: t('assets.table.column1_5'),
      address: '0x586eba6be3ffc2499df154aef81b6d3a342c8e34',
      contractName: 'CyberPop Badge',
      id: [0, 1, 2, 3, 4],
      circulation: fujiBadge,
      owner: '--',
      browser:
        'https://testnet.snowtrace.io/token/0x586eba6be3ffc2499df154aef81b6d3a342c8e34',
    },
  ]);

  // 初次查询 fuji
  const circInit = async () => {
    fujiGame.value.push(
      await web3J.totolsuppl(
        contracts.game_Fuji.abi,
        contracts.game_Fuji.address,
        0
      ),
      await web3J.totolsuppl(
        contracts.game_Fuji.abi,
        contracts.game_Fuji.address,
        2
      )
    );
    fujiRole.value.push(
      await web3J.totolsuppl(
        contracts.Cyborg_Fuji.abi,
        contracts.Cyborg_Fuji.address,
        -1
      )
    );
    fujiHead.value.push(
      await web3J.totolsuppl(
        contracts.cyberClub_Fuji.abi,
        contracts.cyberClub_Fuji.address,
        -1
      )
    );
    fujiBadge.value.push(
      await web3J.totolsuppl(
        contracts.nft_fuji.abi,
        contracts.nft_fuji.address,
        0
      ),
      await web3J.totolsuppl(
        contracts.nft_fuji.abi,
        contracts.nft_fuji.address,
        1
      ),
      await web3J.totolsuppl(
        contracts.nft_fuji.abi,
        contracts.nft_fuji.address,
        2
      ),
      await web3J.totolsuppl(
        contracts.nft_fuji.abi,
        contracts.nft_fuji.address,
        3
      ),
      await web3J.totolsuppl(
        contracts.nft_fuji.abi,
        contracts.nft_fuji.address,
        4
      )
    );
    circFlaFuji.value = 1;
    // console.log(fujiGame.value,fujiRole.value, fujiHead.value);
  };

  const handleSelect = async (v: any) => {
    if (v.value === 'Mumbai') {
      if (circFlagMum.value !== 1) {
        Message.info(t('switch.mumbai'));
        const a: any = await web3J.addChain(80001);
        if (a) {
          nowNetWork.value = v.value;
          Message.success(t('switch.success'));
          setTimeout(async () => {
            mumbaiGame.value.push(
              await web3J.totolsuppl(
                contracts.arms.abi,
                contracts.arms.address,
                0
              ),
              await web3J.totolsuppl(
                contracts.arms.abi,
                contracts.arms.address,
                2
              )
            );
            mumbaiRole.value.push(
              await web3J.totolsuppl(
                contracts.Cyborg.abi,
                contracts.Cyborg.address,
                -1
              )
            );
            mumbaiHead.value.push(
              await web3J.totolsuppl(
                contracts.cyberClub.abi,
                contracts.cyberClub.address,
                -1
              )
            );
            // console.log(mumbaiGame.value, mumbaiRole.value, mumbaiHead.value);
            circFlagMum.value = 1;
          }, 2500);
        }
      }else{
        nowNetWork.value = v.value;
      }
      contractDate.value = [];
      contractDate.value.push(
        {
          name: t('assets.table.column1_1'),
          address: '0x3B52df1CAcb5d397f7A23Bf136DE110584d0Cd60',
          contractName: 'CyberPop Game',
          id: [0, 2],
          circulation: mumbaiGame,
          owner: '--',
          browser:
            'https://mumbai.polygonscan.com/token/0x3B52df1CAcb5d397f7A23Bf136DE110584d0Cd60',
        },
        {
          name: t('assets.table.column1_2'),
          address: '0x37e769d34Cb48fb074fDd181bB4d803fBD49C712',
          contractName: 'CyberPop Cyborg',
          id: -1,
          circulation: mumbaiRole,
          owner: '--',
          browser:
            'https://mumbai.polygonscan.com/token/0x37e769d34Cb48fb074fDd181bB4d803fBD49C712',
        },
        {
          name: t('assets.table.column1_3'),
          address: '0x04b5D133394F360A3B88600043b8153AaA1C0e59',
          contractName: 'CyberPop CyberClub',
          id: -1,
          circulation: mumbaiHead,
          owner: '--',
          browser:
            'https://mumbai.polygonscan.com/token/0x04b5D133394F360A3B88600043b8153AaA1C0e59',
        },
        {
          name: t('assets.table.column1_4'),
          address: '0xC5FE394692a469BD5789D8247F281403e064E576',
          contractName: 'CyberPop Loot Box',
          id: [0, 1, 2],
          circulation: -1,
          owner: '--',
          browser:
            'https://mumbai.polygonscan.com/token/0xC5FE394692a469BD5789D8247F281403e064E576',
        }
      );
    } else if (v.value === 'Fuji') {
      if (circFlaFuji.value !== 1) {
        Message.info(t('switch.fuji'));
        const a: any = await web3J.addChain(43113);
        if (a) {
          nowNetWork.value = v.value;
          Message.success(t('switch.success'));
          setTimeout(async () => {
            circInit();
          }, 2500);
        } else {
          Message.error(t('switch.error'));
        }
      }else{
        nowNetWork.value = v.value;
      }
      contractDate.value = [];
      contractDate.value.push(
        {
          name: t('assets.table.column1_1'),
          address: '0xD4c27B5A5c15B1524FC909F0FE0d191C4e893695',
          contractName: 'CyberPop Game',
          id: [0, 2],
          circulation: fujiGame,
          owner: '--',
          browser:
            'https://testnet.snowtrace.io/token/0xD4c27B5A5c15B1524FC909F0FE0d191C4e893695',
        },
        {
          name: t('assets.table.column1_2'),
          address: '0x78F66E37e9fE077d2F0126E3a26e6FB0D14F2BB0',
          contractName: 'CyberPop Cyborg',
          id: -1,
          circulation: fujiRole,
          owner: '--',
          browser:
            'https://testnet.snowtrace.io/token/0x78F66E37e9fE077d2F0126E3a26e6FB0D14F2BB0',
        },
        {
          name: t('assets.table.column1_3'),
          address: '0x4B4cbe55125B48e868AA68E08b7527524C46E8AC',
          contractName: 'CyberPop CyberClub',
          id: -1,
          circulation: fujiHead,
          owner: '--',
          browser:
            'https://testnet.snowtrace.io/token/0x4B4cbe55125B48e868AA68E08b7527524C46E8AC',
        },
        {
          name: t('assets.table.column1_4'),
          address: '0x55eFD6D4cF31F925E36d268C12353848c9e782fD',
          contractName: 'CyberPop Loot Box',
          id: [0, 1, 2, 3, 4],
          circulation: fujiBadge,
          owner: '--',
          browser:
            'https://testnet.snowtrace.io/token/0x55eFD6D4cF31F925E36d268C12353848c9e782fD',
        }
      );
    }
  };

  const getMyInvit = async () => {
    const web3obj = new Web3((Web3 as any).givenProvider);
    await web3obj.eth.net.getId().then(async (chainId: any) => {
      console.log(chainId);
      // eslint-disable-next-line eqeqeq
      if (chainId != 43113) {
        Message.info(t('switch.fuji'));
        const a: any = await web3J.addChain(43113);
        if (a) {
          Message.success(t('switch.success'));
          circInit();
        }
      } else {
        circInit();
      }
    });
  };

  // const onPageChange = (current: number) => {
  //   pagination.value.startPage = current;
  //   getMyInvit();
  // };

  onMounted(() => {
    getMyInvit();
  });
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }

  .panel-col {
    padding-left: 20px;

    .my-card {
      width: 100%;
      border: none !important;

      .haveId {
        button + button {
          margin-top: 4px;
        }
      }

      .browser {
        color: rgb(var(--primary-6));
        text-decoration: none;
        cursor: pointer;

        &:hover {
          color: blue;
        }
      }

      &:hover {
        box-shadow: none;
      }
    }
  }

  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .panel-col {
      padding-left: 0;

      :deep(.arco-card-body) {
        padding: 16px 0 !important;

        .arco-table-td:nth-child(2) {
          .arco-table-cell {
            width: 220px;
          }
        }

        .arco-table-td:last-child,
        .arco-table-td:first-child {
          .arco-table-cell {
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
