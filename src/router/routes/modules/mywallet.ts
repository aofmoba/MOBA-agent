export default {
  path: 'my-wallet',
  name: 'MyWallet',
  component: () => import('@/views/mywallet/index.vue'),
  meta: {
    locale: 'menu.mywallet',
    icon: 'icon-layout',
    order: 1,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
