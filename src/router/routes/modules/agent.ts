export default {
  path: 'agent',
  name: 'AgentManagement',
  component: () => import('@/views/agent/index.vue'),
  meta: {
    locale: 'menu.agent',
    icon: 'icon-bar-chart',
    order: 2,
    // requiresAuth: true,
    hideChildrenInMenu: true,
  },
};
