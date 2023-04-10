export default {
  path: 'workplace',
  name: 'Workplace',
  component: () => import('@/views/workplace/index.vue'),
  meta: {
    locale: 'menu.workplace',
    icon: 'icon-dashboard',
    order: 0,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
