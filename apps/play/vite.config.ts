import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { fileURLToPath } from "node:url";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver()], // 解析 ElMessage 这类 API，importStyle: false 表示不引入样式通过main.ts中引入css文件
    }),
    Components({
      resolvers: [ElementPlusResolver()], // 也可以解析 <el-button> 这类组件
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
