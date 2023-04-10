export default {
  path: 'promotion',
  name: 'PromotionLink',
  component: () => import('@/views/promotion/index.vue'),
  meta: {
    locale: 'menu.link',
    icon: 'icon-share-internal',
    order: 4,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
