export const iconsVueSidebar = {
  '/icons-vue/': [
    { text: '@fly/icons-vue', items: [] },
    {
      text: '指南',
      collapsed: true,
      items: [
        { text: '快速上手', link: '/icons-vue/quickly-start' },
        { text: '架构设计', link: '/icons-vue/architecture' },
      ],
    },
    {
      text: '组件',
      items: [
        { text: '图标组件', link: '/icons-vue/pages/icon-component/' },
        { text: '图标集合', link: '/icons-vue/pages/icon-list/' },
      ],
    },
    {
      text: '变更日志',
      link: '/icons-vue/changelog',
    },
  ],
};
