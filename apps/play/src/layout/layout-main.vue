<template>
  <div class="common-layout">
    <el-container class="common-layout-container">
      <el-header class="common-layout-header">
        <div class="layout-header">
          <div class="header-title">
            <el-text size="large"> taxjoy-dev-play </el-text>
          </div>
        </div>
      </el-header>
      <el-container style="overflow: hidden; display: flex">
        <el-aside class="common-layout-aside">
          <el-scrollbar>
            <el-menu
              class="common-layout-menu"
              router
              :default-active="defaultActiveMenu"
            >
              <!-- <el-sub-menu index="1">
              <template #title>
                <el-icon><icon-menu /></el-icon>
                <span>基础组件</span>
              </template>
            </el-sub-menu> -->

              <el-menu-item
                v-for="item in menuList"
                :key="item.index"
                :index="item.index"
                :route="item.route"
                @click="handleMenuItemClick"
              >
                {{ item.text }}
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-scrollbar class="layout-main-scrollbar">
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {
  ElContainer,
  ElAside,
  ElMain,
  ElHeader,
  ElScrollbar,
  ElText,
  ElMenu,
  ElMenuItem,
} from "element-plus";
import { useRouter, useRoute } from "vue-router";
import type { MenuItemRegistered } from "element-plus";
import { pagesName } from "@/utils/auto";

const menuListData = pagesName.map((item) => {
  return {
    text: item,
    route: `/${item}`,
    index: item,
  };
});

const router = useRouter();
const route = useRoute();

const defaultActiveMenu = ref(route.name as string);
watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      defaultActiveMenu.value = newVal as string;
    }
  }
);

const menuList = ref(menuListData);

const handleMenuItemClick = ({ index }: MenuItemRegistered) => {
  const item = menuList.value.find((item) => item.index === index);
  router.push(item!.route);
};
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100%;
  height: 100%;
  .layout-header {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .header-title {
      font-size: 20px;
      font-weight: 700;
      line-height: 60px;
    }
  }
}
</style>

<style lang="scss">
.common-layout-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.common-layout-header {
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
  height: 60px;
}
.common-layout-aside {
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 10px 0px;
  height: calc(100vh - 60px);
  overflow: hidden;
  padding-right: 15px;
}
.common-layout-menu {
  border-right: none;
}
.layout-main-scrollbar {
  max-height: calc(100vh - 60px - 40px);
}
</style>
