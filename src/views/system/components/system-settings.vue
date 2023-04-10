<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="24">
      <div class="title">{{ $t('system.password') }}</div>
      <div class="content">
        <div class="card">
          <div class="item">
            <span class="label">{{ $t('system.label') }} : </span>
            <span class="num">{{ cardData.pwd }}</span>
          </div>
        </div>
        <div class="nft" :loading="loading">
          <div class="name">{{ $t('system.nft') }} :</div>
          <a-button-group class="typeBtn">
            <a-button
              type="outline"
              class="typeALL"
              :class="!ecrType ? 'active' : ''"
              @click="changeType(0)"
              >ALL</a-button
            >
            <a-button
              type="outline"
              class="type721"
              :class="ecrType == 1 ? 'active' : ''"
              @click="changeType(1)"
              >ERC 721</a-button
            >
            <a-button
              type="outline"
              class="type1155"
              :class="ecrType == 2 ? 'active' : ''"
              @click="changeType(2)"
              >ERC 1155</a-button
            >
          </a-button-group>
        </div>
      </div>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  // import { useRouter } from 'vue-router';
  // import { Message } from '@arco-design/web-vue';
  // const router = useRouter();
  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const ecrType = ref(0);
  const cardData: any = {
    pwd: '******',
  };

  const changeType = (type: any) => {
    ecrType.value = type;
    // getData(type);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // const { data: chartData } = await queryContentData();
      // chartData.forEach((el: any, idx: number) => {
      //   xAxis.value.push(el.x);
      //   chartsData.value.push(el.y);
      // });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
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
        padding: 16px 0;
        border: 1px solid #e5e8ef;
        border-radius: 4px;

        .item {
          padding: 10px 30px;

          .label {
            padding-right: 18px;
            color: var(--color-text-2);
            font-size: 16px;
          }

          .num {
            margin-right: 40px;
            color: black;
            font-size: 16px;
          }

          .btn {
            border-radius: 4px;
          }
        }

        &:hover {
          box-shadow: 1px 1px 3px #e5e8ef;
        }
      }

      .nft {
        margin-bottom: 20px;
        padding-left: 30px;

        .name {
          padding: 40px 0 20px;
          color: var(--color-text-1);
          font-weight: 500;
          font-size: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .typeBtn {
          .active {
            color: #fff;
            background: #165dff;
          }
        }
      }
    }
  }
</style>
