<template>
  <div :class="[ns.b()]">我是transfer组件</div>
</template>
<script lang="ts" setup>
  import { useNamespace } from '../../hooks/use-namespace';
  const ns = useNamespace('transfer');
</script>
<style lang="scss" scoped>
  @use '@fly/theme-chalk/mixins' as *;

  @include b(transfer) {
    // 组件样式直接写在这里
    width: 100px;
    background-color: red;
  }
</style>
