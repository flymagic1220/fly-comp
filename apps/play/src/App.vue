<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}
</style>
