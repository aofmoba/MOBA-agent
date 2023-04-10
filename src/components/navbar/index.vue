<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img
          alt="logo"
          style="width: 50px;"
          src="https://moba-project.s3-accelerate.amazonaws.com/front/common/h-logo.webp"
        />
        <a-typography-title
          :heading="5"
          :style="{ margin: 0, fontSize: '18px' }"
        >
        Arena of Faith Online X-Plan
        </a-typography-title>
        <icon-menu-fold
          v-if="appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer; color: var(--color-text-1);"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <ul class="right-side">
      <!-- <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button :shape="'circle'" class="nav-btn" type="outline">
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            :shape="'circle'"
            class="nav-btn"
            type="outline"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            :shape="'circle'"
            class="nav-btn"
            type="outline"
            @click="toggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!-- <li>
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                :shape="'circle'"
                class="nav-btn"
                type="outline"
                @click="setPopoverVisible"
              >
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover"
          trigger="click"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box />
          </template>
        </a-popover>
      </li> -->
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
            :shape="'circle'"
            class="nav-btn"
            type="outline"
            @click="setVisible"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-avatar :size="32" :style="{ marginRight: '8px' }">
            <!-- <img :src="avatar" alt="avatar" /> -->
            <img
              src="//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png"
              alt="avatar"
            />
          </a-avatar>
          <template #content>
            <!-- <a-doption>
              <a-space @click="switchRoles">
                <icon-tag />
                <span>
                  {{ $t('messageBox.switchRoles') }}
                </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'info' })">
                <icon-user />
                <span>
                  {{ $t('messageBox.userCenter') }}
                </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'setting' })">
                <icon-settings />
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption> -->
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, inject, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  // import MessageBox from '../message-box/index.vue';

  export default defineComponent({
    components: {
      // MessageBox,
    },
    setup() {
      const appStore = useAppStore();
      const userStore = useUserStore();
      const { logout } = useUser();
      const { changeLocale } = useLocale();
      const locales = [...LOCALE_OPTIONS];
      const avatar = computed(() => {
        // return userStore.$state.data.avatar;
        return userStore;
      });
      const theme = computed(() => {
        return appStore.theme;
      });
      const isDark = useDark({
        selector: 'body',
        attribute: 'arco-theme',
        valueDark: 'dark',
        valueLight: 'light',
        storageKey: 'arco-theme',
        onChanged(dark: boolean) {
          // overridded default behavior
          appStore.toggleTheme(dark);
        },
      });
      const toggleTheme = useToggle(isDark);
      const setVisible = () => {
        appStore.updateSettings({ globalSettings: true });
      };
      const refBtn = ref();
      const triggerBtn = ref();
      const setPopoverVisible = () => {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        refBtn.value.dispatchEvent(event);
      };
      const handleLogout = () => {
        logout();
      };
      const setDropDownVisible = () => {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        triggerBtn.value.dispatchEvent(event);
      };
      const switchRoles = async () => {
        const res = await userStore.switchRoles();
        Message.success(res as string);
      };
      const toggleDrawerMenu = inject('toggleDrawerMenu');
      return {
        appStore,
        locales,
        theme,
        avatar,
        changeLocale,
        toggleTheme,
        setVisible,
        setPopoverVisible,
        refBtn,
        triggerBtn,
        handleLogout,
        setDropDownVisible,
        switchRoles,
        toggleDrawerMenu,
      };
    },
  });
</script>

<style lang="less" scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;

    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      border-color: rgb(var(--gray-2));
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-xs) {
    .navbar {
      .arco-typography {
        display: none;
      }
    }
  }
</style>
