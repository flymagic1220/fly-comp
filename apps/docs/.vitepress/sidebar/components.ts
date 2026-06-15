const componentsSidebar = {
  '/components/': [
    { text: '@fly/components', items: [] },
    {
      text: '指南',
      collapsed: true,
      items: [
        { text: '介绍', link: '/components/' },
        { text: '安装', link: '/components/install' },
        { text: '使用', link: '/components/start-use' },
        { text: '架构设计', link: '/components/architecture' },
      ],
    },
    {
      text: '全局配置',
      items: [{ text: 'Config Provider 全局配置', link: '/components/ConfigProvider/' }],
    },
    {
      text: '组件',
      items: [{ text: 'Transefer 穿梭框', link: '/components/Transfer/' }],
    },
    {
      text: '业务组件',
      items: [
        { text: 'Import 导入', link: '/components/Import/' },
        { text: 'Export 导出', link: '/components/Export/' },
      ],
    },
    {
      text: '变更日志',
      link: '/components/changelog',
    },
  ],
};

componentsSidebar['/components/']
  .find((item) => item.text === '组件')
  ?.items?.sort((a, b) => {
    return a.text.localeCompare(b.text);
  });

export { componentsSidebar };
