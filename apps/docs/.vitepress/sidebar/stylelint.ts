export const stylelintSidebar = {
  '/stylelint/': [
    { text: '@fly/stylelint-config', items: [] },
    {
      text: '指南',
      items: [
        { text: '介绍', link: '/stylelint/' },
        { text: '安装', link: '/stylelint/install' },
        { text: '使用', link: '/stylelint/use' },
        { text: '架构设计', link: '/stylelint/architecture' },
      ],
    },
    {
      text: '配置文件列表',
      items: [
        { text: 'base.js', link: '/stylelint/configs/base' },
        { text: 'vue-internal.js', link: '/stylelint/configs/vue-internal' },
      ],
    },
    {
      text: '变更日志',
      link: '/stylelint/changelog',
    },
  ],
};
