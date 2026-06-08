import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error no types  // 这个插件没有 TypeScript 类型定义
import dts from 'unplugin-dts/vite';
import removeConsole from 'vite-plugin-remove-console';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  // 判断是否为 watch 模式（开发监听模式）
  const isWatchMode = process.argv.includes('--watch');

  // 基础插件：类型声明生成 + Vue 解析 + JSX 支持
  const plugins = [dts({ processor: 'vue' }), Vue(), vueJsx()];

  // 生产模式下（非 watch 模式）才移除 console.log
  // watch 模式下保留 console，方便调试
  if (!isWatchMode) {
    plugins.push(removeConsole({ externalValue: ['noRemove'] }));
  }

  return {
    plugins,
    build: {
      // 库模式配置
      lib: {
        // 入口配置：支持多入口（这里只有一个 index）
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
        },
        // UMD 格式的全局变量名（浏览器中可用）
        name: 'FlyComponents',
        // 输出文件命名：入口名.格式.js
        // 例如：index.es.js 和 index.umd.js
        fileName: (format, entryName) => `${entryName}.${format}.js`,
      },

      rollupOptions: {
        // 排除的都是peerDependencies 中的依赖，不打包这些库，由使用方提供
        // 避免重复打包，减小组件库体积
        external: ['vue'],
        output: {
          // UMD 格式下的全局变量映射
          // 当通过 script 标签引入时，[peerDependencies]中的依赖需要提前挂载到 window 对象
          globals: {
            vue: 'Vue', // window.Vue
          },
        },
      },

      // 代码压缩：watch 模式下不压缩（保留可读性，方便调试）
      // 生产构建时使用 esbuild 压缩（速度快，体积小）
      minify: isWatchMode ? false : 'esbuild',

      // 注释掉的配置：是否清空输出目录
      // emptyOutDir: isWatchMode ? false : true,

      // 是否报告压缩后的体积（仅生产模式）
      // watch 模式不报告（避免频繁输出）
      reportCompressedSize: isWatchMode ? false : true,
    },
  };
});
