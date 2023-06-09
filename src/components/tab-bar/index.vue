<template>
  <div class="tab-bar-container">
    <a-affix ref="affixRef" :offset-top="offsetTop">
      <div class="tab-bar-box">
        <div class="tab-bar-scroll">
          <div class="tags-wrap">
            <span
              v-for="(tag, index) in tagList"
              :key="tag.fullPath"
              class="arco-tag arco-tag-size-medium arco-tag-checked"
            >
              <router-link class="tag-link" :to="tag">
                {{ $t(tag.title) }}
              </router-link>
              <span
                class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
              >
                <icon-close @click="tagClose(tag, index)" />
              </span>
            </span>
          </div>
        </div>
        <div class="tag-bar-operation"></div>
      </div>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import type { RouteLocationNormalized } from 'vue-router';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { useAppStore, useTabBarStore } from '@/store';
  import type { TagProps } from '@/store/modules/tab-bar/types';

  const appStore = useAppStore();
  const tabBarStore = useTabBarStore();

  const router = useRouter();
  const affixRef = ref();
  const tagList = computed(() => {
    return tabBarStore.getTabList;
  });
  const offsetTop = computed(() => {
    return appStore.navbar ? 60 : 0;
  });

  watch(
    () => appStore.navbar,
    () => {
      affixRef.value.updatePosition();
    }
  );
  listenerRouteChange((route: RouteLocationNormalized) => {
    if (
      !route.meta.noAffix &&
      !tagList.value.some((tag) => tag.fullPath === route.fullPath)
    ) {
      console.log(tagList);

      tabBarStore.updateTabList(route);
    }
  }, true);
  const tagClose = (tag: TagProps, idx: number) => {
    tabBarStore.deleteTag(idx);
    if (idx === tagList.value.length) {
      const latest = tagList.value[tagList.value.length - 1];
      router.push({ name: latest.name });
    }
  };
</script>

<style scoped lang="less">
  .tab-bar-container {
    position: relative;
    background-color: var(--color-bg-2);

    .tab-bar-box {
      display: flex;
      padding: 0 0 0 20px;
      background-color: var(--color-bg-2);
      border-bottom: 1px solid var(--color-border);

      .tab-bar-scroll {
        flex: 1;
        overflow: hidden;

        .tags-wrap {
          padding: 4px 0;
          overflow-x: auto;
          white-space: nowrap;

          :deep(.arco-tag) {
            margin-right: 6px;

            &:first-child {
              .arco-tag-close-btn {
                display: none;
              }
            }
          }
        }
      }
    }

    .tag-bar-operation {
      width: 100px;
      height: 33px;
    }
  }

  .tag-link {
    color: var(--color-text-2);
    text-decoration: none;
  }

  .router-link-active {
    color: rgb(var(--link-6));

    & + .arco-tag-close-btn {
      color: rgb(var(--link-6));
    }
  }

  :deep(.arco-affix) {
    z-index: 90;
    overflow-x: auto;
    background-color: var(--color-bg-2);
  }
</style>
