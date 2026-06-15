export const requestSidebar = {
  '/request/': [
    { text: '@fly/request', items: [] },
    {
      text: '指南',
      items: [
        { text: '介绍', link: '/request/' },
        { text: '安装', link: '/request/install' },
        { text: '使用', link: '/request/use' },
        { text: '架构设计', link: '/request/architecture' },
      ],
    },
    {
      text: 'API介绍',
      items: [
        { text: '实例方法', link: '/request/pages/instance' },
        { text: '请求方法', link: '/request/pages/requestMethods' },
        { text: '工具函数', link: '/request/pages/utils' },
      ],
    },
    {
      text: '变更日志',
      link: '/request/changelog',
    },
  ],
};
