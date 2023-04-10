<template>
  <div class="charts">
    <div class="name">{{ $t('wallet.charts.title') }} :</div>
    <Chart height="420px" :option="chartOption" />
  </div>
</template>

<script lang="ts" setup>
  import type { ToolTipFormatterParams } from '@/types/echarts';
  import { ref } from 'vue';

  const chartsData = ref<number[]>([]);
  const xAxis = ref<string[]>([]);
  chartsData.value = [0, 0, 0, 0, 0];
  xAxis.value = [
    '2022-5-09',
    '2022-5-10',
    '2022-5-11',
    '2022-5-12',
    '2022-5-13',
  ];
  const chartOption: any = {
    xAxis: {
      type: 'category',
      offset: 2,
      data: xAxis.value,
      axisLabel: {
        color: '#4E5969',
        formatter(value: number, idx: number) {
          if (idx === 0) return value;
          // if (idx === xAxis.value.length - 1) return '';
          return `${value}`;
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#4E5969',
        },
      },
      axisTick: {
        show: false,
      },
    },
    axisPointer: {
      show: true,
      lineStyle: {
        color: '#23ADFF',
        width: 1,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#4E5969',
        },
      },
      axisLabel: {
        margin: 0,
        padding: [0, 6, 0, 0],
        formatter(value: any, idx: number) {
          if (idx === 0) return value;
          return `${value}`;
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          // type: 'dashed',
          color: '#E5E8EF',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter(params: any) {
        const [firstElement] = params as ToolTipFormatterParams[];
        return `<div>
          <p class="tooltip-title">${firstElement.axisValueLabel}</p>
          <div class="content-panel"><span>Sales</span><span class="tooltip-value">${Number(
            firstElement.value
          ).toLocaleString()}</span></div>
        </div>`;
      },
      className: 'echarts-tooltip-diy',
    },
    series: [
      {
        type: 'bar',
        data: chartsData.value,
        barWidth: '30%',
        symbolSize: 12,
      },
    ],
  };
</script>

<style scoped lang="less">
  .charts {
    margin-bottom: 20px;

    .name {
      padding-top: 40px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 16px;
      white-space: nowrap;
      text-indent: 30px;
      text-overflow: ellipsis;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .charts {
      .name {
        text-indent: 0 !important;
      }
    }
  }
</style>
