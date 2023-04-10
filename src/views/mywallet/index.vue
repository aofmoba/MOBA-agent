<template>
  <div class="container">
    <Breadcrumb :items="['menu.mywallet']" />
    <a-grid :cols="24" :col-gap="16" :row-gap="16" class="panel">
      <a-grid-item :span="24" class="panel-col">
        <div class="title">{{ $t('wallet.card.title') }}</div>
        <WalletInfo @get-user="getUserId" />
      </a-grid-item>
      <a-grid-item :span="24" class="panel-col">
        <div class="title">{{ $t('wallet.share.title') }}</div>
        <CommissionRecord :userid="userID" />
      </a-grid-item>
      <!-- <a-grid-item :span="24" class="panel-col">
          <ContentChart />
      </a-grid-item> -->
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import WalletInfo from './components/wallet-info.vue';
  import CommissionRecord from './components/commission-record.vue';
  // import ContentChart from './components/content-chart.vue';
  const userID: any = ref('');
  const getUserId = (id: any) => {
    userID.value = id;
  };
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    width: 100%;
    overflow: auto;
  }

  .panel-col {
    padding: 16px 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px;

    .title {
      padding-bottom: 20px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;

      .arco-grid {
        // gap: 0 !important;
      }
    }
  }
</style>
