import globals from 'globals';
import { config as baseConfig } from './base.js';
import eslintPluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import VueParse from 'vue-eslint-parser';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

/**
 * A custom ESLint configuration for libraries that use Vue.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  // ...eslintPluginVue.configs['flat/recommended'],
  ...defineConfigWithVueTs(eslintPluginVue.configs['flat/recommended'], vueTsConfigs.recommended),
  { 
    rules: {
        // 覆盖 base 中的 warn 为 error，不额外放行任何环境变量。未在 Turbo 配置中声明的环境变量会直接报错
      'turbo/no-undeclared-env-vars': ['error', { allowList: [] }],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker, // Service Worker API）不会被报未定义
        ...globals.browser, //  Service Worker API）不会被报未定义
      },
      parser: VueParse, // 解析 .vue 文件，这是必须的——ESLint 默认不支持 .vue 语法
      parserOptions: {
        // Vue 解析器遇到 <script> 块时，委托给 @typescript-eslint/parser 来解析 TypeScript
        parser: tseslint.parser,
        //启用 JSX 语法支持（Vue 3 支持 JSX/TSX 写法）
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // Vue 模板自闭合标签：void 元素（如 <br>、<img>）要求自闭合，普通元素和组件不强制
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'any',
            component: 'any',
          },
        },
      ],
      //  关闭"每行最多属性数"限制，允许属性自由排列
      'vue/max-attributes-per-line': 'off', 
      // 使用 any 类型时给出警告（不强制禁止
      '@typescript-eslint/no-explicit-any': 'warn',
      // 关闭"单行元素内容需要换行"的限制
      'vue/singleline-html-element-content-newline': 'off',
      // 强制 <script> 块必须声明 lang="ts" 或 lang="tsx"，不允许裸 <script>
      'vue/block-lang': ['error', { script: { lang: ['ts', 'tsx'] } }],
      // 关闭 v-slot 校验（可能与某些库的 slot 用法冲突）
      'vue/valid-v-slot': 'off',
    },
  },
];
