import type { Component, App } from 'vue';
import { FlTransfer } from './fl-transfer';

const Components: { [key: string]: Component } = {
  FlTransfer,
};
const FlyComponents = {
  install(app: App) {
    Object.keys(Components).forEach((key) => {
      app.component(key, Components[key]!);
    });
  },
};
export { FlyComponents };
export * from './fl-transfer';
