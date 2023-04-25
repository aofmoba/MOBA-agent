import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import router from '../router'

export default function useUser() {
  // const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...router.currentRoute.value.query,
        redirect: `${currentRoute.name as string}#1`,
      },
    });
  };
  return {
    logout,
  };
}
