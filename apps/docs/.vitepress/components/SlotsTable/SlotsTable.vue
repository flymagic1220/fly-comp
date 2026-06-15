<template>
  <el-table :data="data" style="width: 100%" size="large">
    <el-table-column prop="prop" label="插槽名">
      <template #default="{ row }">
        <div class="name-wrap">
          <div>{{ row.name?.text || row.name }}</div>
          <el-tag v-if="row.prop?.version" type="primary" effect="plain" round size="small">
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

    <el-table-column prop="default" label="子标签">
      <template #default="{ row }">
        {{ row.childTag || '-' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { ElTable, ElTableColumn, ElTag, ElIcon, ElTooltip, ElText } from 'element-plus';
  import { Warning } from '@element-plus/icons-vue';
  import type { SlotsTableData } from './types';

  withDefaults(
    defineProps<{
      data?: SlotsTableData;
    }>(),
    {
      data: () => [],
    }
  );
</script>

<style lang="scss" scoped>
  .name-wrap {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>
