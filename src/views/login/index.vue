<template>
  <div class="container">
    <div class="logo">
      <img
        alt="logo"
        style="width: 50px;"
        src="https://moba-project.s3-accelerate.amazonaws.com/front/common/h-logo.webp"
      />
      <div class="logo-text">Arena of Faith Testnet X-Plan</div>
    </div>
    <LoginBanner />
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;

    .banner {
      width: 550px;
      background: rgba(0,0,0,1);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .logo {
        left: 10px;
        width: calc(25% - 10px);
      }

      .banner {
        width: 25%;
      }
    }
  }
  @media (max-width: @screen-xs) {
    .container {
      .logo {
        width: 100%;

        .logo-text {
          color: var(--color-text-1);
        }
      }

      .banner {
        width: 0;
      }
    }
  }
</style>
