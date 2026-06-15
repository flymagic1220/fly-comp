---
description: theme-chalk 快速开始
head:
  - - meta
    - name: keywords
      content: vue3 theme-chalk 快速开始
---

# 快速开始

本节介绍如何在项目中引入和使用主题样式库。

## 安装

```shell [pnpm]
pnpm add @fly/theme-chalk
```

## 引入样式

在项目入口文件中引入：

```ts{3} [main.ts]
import { createApp } from 'vue';
import App from './App.vue';
import '@fly/theme-chalk/dist/index.css';

const app = createApp(App);
app.mount('#app');
```
