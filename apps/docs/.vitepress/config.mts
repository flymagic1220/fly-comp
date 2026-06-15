import { defineConfig } from 'vitepress';
import {
  componentsSidebar,
  iconsVueSidebar,
  themeChalkSidebar,
  requestSidebar,
  utilsSidebar,
  eslintSidebar,
  stylelintSidebar,
  typescriptSidebar,
  codebuddySidebar,
  cdnSidebar,
} from './sidebar';
import { libraryNav, docDevNav } from './nav';
import { fileURLToPath, URL } from 'node:url';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'fly frontend',
  description: 'fly frontend team docs',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
  ],
  cleanUrls: true,
  srcDir: 'src',
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: '前端文档',
    logo: '/favicon.ico',
    nav: [{ text: '首页', link: '/' }, libraryNav, docDevNav],

    sidebar: {
      ...componentsSidebar,
      ...iconsVueSidebar,
      ...themeChalkSidebar,
      ...eslintSidebar,
      ...stylelintSidebar,
      ...typescriptSidebar,
      ...requestSidebar,
      ...utilsSidebar,
      ...codebuddySidebar,
      ...cdnSidebar,
    },

    outline: {
      level: 'deep',
      label: '本页内容',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [{ icon: 'gitlab', link: 'http://192.168.7.9/fe/fly-comp' }],

    externalLinkIcon: true,
  },
  vite: {
    server: {
      port: 5176,
      proxy: {
        '/gateway': {
          target: 'https://dev.example.com',
          changeOrigin: true,
        },
      },
    },
    plugins: [vueJsx()],
    resolve: {
      alias: {
        vt: fileURLToPath(new URL('./.vitepress', import.meta.url)),
        '@': fileURLToPath(new URL('../src', import.meta.url)),
      },
    },
  },
});
