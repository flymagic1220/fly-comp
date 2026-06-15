export const cdnSidebar = {
  '/cdn/': [
    { text: '@fly/cdn', items: [] },
    {
      text: '指南',
      collapsed: true,
      items: [{ text: '快速上手', link: '/cdn/quickly-start' }],
    },
    {
      text: '资源',
      items: [
        { text: '字体集合', link: '/cdn/pages/font-list/' },
        { text: '图片集合', link: '/cdn/pages/image-list/' },
      ],
    },
    {
      text: '变更日志',
      link: '/cdn/changelog',
    },
  ],
};
