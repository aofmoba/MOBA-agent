<template>
  <router-view v-slot="{ Component, currentRoute = route }">
    <component
      :is="Component"
      v-if="currentRoute.meta.ignoreCache"
      :key="currentRoute.fullPath"
    />
    <keep-alive v-else>
      <component :is="Component" :key="currentRoute.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>

<style scoped lang="less"></style>
