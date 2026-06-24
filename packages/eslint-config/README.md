# `@fly/eslint-config`

Fly 共享 ESLint flat config 集合，适用于 TypeScript + React/Vue/Next.js 项目。

## 安装

```bash
pnpm add -D @fly/eslint-config
```

## 使用

在项目根目录创建 `eslint.config.ts`（或 `.js`），导入对应配置：

### base — 基础配置

```ts
import { config } from '@fly/eslint-config/base';

export default config;
```

| 导出         | 说明                                                                            |
| ------------ | ------------------------------------------------------------------------------- |
| `baseConfig` | 不含 TypeScript 的基础配置（eslint:recommended + prettier + turbo + only-warn） |
| `config`     | `baseConfig` + typescript-eslint （纯ts项目使用）                               |

### vue-internal — Vue 项目

```ts
import { config } from '@fly/eslint-config/vue-internal';

export default config;
```

适用于 Vue 3 + TypeScript 项目，包含 `eslint-plugin-vue` 和 `@vue/eslint-config-typescript`。

### react-internal — React 项目

```ts
import { config } from '@fly/eslint-config/react-internal';

export default config;
```

适用于 React + TypeScript 项目，包含 `eslint-plugin-react` 和 `eslint-plugin-react-hooks`。

### next-js — Next.js 项目

```ts
import { config } from '@fly/eslint-config/next-js';
```

> 注意：导出名为 `nextJsConfig`

适用于 Next.js + TypeScript 项目，包含 `@next/eslint-plugin-next`。

## 类型声明

所有配置均提供 `.d.ts` 类型声明文件，TypeScript 项目中可直接导入，无需额外配置。
