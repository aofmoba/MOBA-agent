import type { LocationQueryRaw, Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if( window.location.href.indexOf("#1") === -1 ){ // 减少页面手动输入时再次刷新的进度条显示
      NProgress.start();
    }
    const userStore = useUserStore();

    async function crossroads() {
      const Permission = usePermission();
      if (Permission.accessRouter(to)) await next();
      else {
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.role
        ) || {
          name: 'notFound',
        };
        await next(destination);
      }
      NProgress.done();
    }

    if (isLogin()) {
      if (userStore.role) {
        crossroads();
      } else {
        try {
          await userStore.info();
          crossroads();
        } catch (error) {
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
          NProgress.done();
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        NProgress.done();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      NProgress.done();
    }
  });
}
