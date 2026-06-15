<template>
  <el-table :data="data" style="width: 100%" size="large">
    <el-table-column prop="name" label="名称">
      <template #default="{ row }">
        <div class="prop-wrap">
          <div>{{ row.name?.text || row.name }}</div>
          <el-tag v-if="row.name?.version" type="primary" effect="plain" round size="small">
            {{ row.name.version }}
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
  </el-table>
</template>

<script lang="ts" setup>
  import { ElTable, ElTableColumn, ElTag, ElIcon, ElTooltip, ElText } from 'element-plus';
  import { Warning } from '@element-plus/icons-vue';
  import type { ExposesTableData } from './types';

  withDefaults(
    defineProps<{
      data?: ExposesTableData;
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
