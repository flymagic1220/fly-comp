import DefaultTheme from 'vitepress/theme';
import ElementPlus from 'element-plus';
import './custom.css';
import PropsTable from '../components/PropsTable/PropsTable.vue';
import SlotsTable from '../components/SlotsTable/SlotsTable.vue';
import EventTable from '../components/EventTable/EventTable.vue';
import ExposesTable from '../components/ExposesTable/ExposesTable.vue';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { nextTick, type App, watch, h } from 'vue';
import { createMermaidRenderer } from 'vitepress-mermaid-renderer';
import { useData } from 'vitepress';

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { isDark } = useData();

    const initMermaid = () => {
      const mermaidRenderer = createMermaidRenderer({
        theme: isDark.value ? 'dark' : 'forest',
      });
    };

    // initial mermaid setup
    nextTick(() => initMermaid());

    // on theme change, re-render mermaid charts
    watch(
      () => isDark.value,
      () => {
        initMermaid();
      }
    );

    return h(DefaultTheme.Layout);
  },
  enhanceApp({ app }: { app: App }) {
    app.use(ElementPlus);
    app.component('PropsTable', PropsTable);
    app.component('SlotsTable', SlotsTable);
    app.component('EventTable', EventTable);
    app.component('ExposesTable', ExposesTable);
  },
};
