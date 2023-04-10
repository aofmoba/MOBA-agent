<template>
  <div class="container">
    <Breadcrumb :items="['menu.asset']" />
    <div class="content">
      <a-grid :cols="24" :col-gap="16" :row-gap="16">
        <a-grid-item :span="24">
          <AssetsTable />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import PopularContent from './components/popular-content.vue';
  import AssetsTable from './components/assets-table.vue';
</script>

<style lang="less" scoped>
  .panel {
    overflow: auto;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;

      .arco-grid {
        gap: 0 !important;
      }
    }
  }
</style>
