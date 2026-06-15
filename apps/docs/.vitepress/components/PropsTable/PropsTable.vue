<template>
  <el-table :data="data" style="width: 100%" size="large">
    <el-table-column prop="prop" label="属性名">
      <template #default="{ row }">
        <div class="prop-wrap">
          <div>{{ row.prop?.text || row.prop }}</div>
          <el-tag v-if="row.prop?.version" type="primary" effect="plain" round size="small">
            {{ row.prop.version }}
          </el-tag>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="desc" label="说明">
      <template #default="{ row }">
        <div v-html="row.desc"></div>
      </template>
    </el-table-column>

    <el-table-column prop="type" label="类型" header-align="left">
      <template #default="{ row }">
        <div class="type-wrap">
          <div v-for="(item, index) in row.type" :key="item.text" class="type-item">
            <el-tag type="info">{{ item.text }}</el-tag>
            <el-tooltip v-if="item.tip" effect="light" trigger="click">
              <el-icon size="16" style="cursor: pointer"><Warning /></el-icon>
              <template #content>
                <el-text type="primary" size="large">
                  {{ item.tip.replace('|', ' | ') }}
                </el-text>
              </template>
            </el-tooltip>
            <div v-if="index < row.type.length - 1">/</div>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="default" label="默认值">
      <template #default="{ row }">
        {{ row.default || '-' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { ElTable, ElTableColumn, ElTag, ElIcon, ElTooltip, ElText } from 'element-plus';
  import { Warning } from '@element-plus/icons-vue';
  import type { PropsTableData } from './types';

  withDefaults(
    defineProps<{
      data?: PropsTableData;
    }>(),
    {
      data: () => [],
    }
  );
</script>

<style lang="scss" scoped>
  .prop-wrap {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .type-wrap {
    display: flex;
    gap: 8px;
    align-items: center;

    .type-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
</style>
