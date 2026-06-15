<template>
  <el-table :data="data" style="width: 100%" size="large">
    <el-table-column prop="prop" label="事件名称">
      <template #default="{ row }">
        <div class="name-wrap">
          <div>{{ row.name?.text || row.name }}</div>
          <el-tag v-if="row.name?.version" type="primary" effect="plain" round size="small">
            {{ row.name.version }}
          </el-tag>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="desc" label="描述">
      <template #default="{ row }">
        <div v-html="row.desc"></div>
      </template>
    </el-table-column>
    <el-table-column prop="value" label="类型">
      <template #default="{ row }">
        <div v-html="row.value"></div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
  import { ElTable, ElTableColumn, ElTag } from 'element-plus';
  import type { EventTableData } from './types';

  withDefaults(
    defineProps<{
      data?: EventTableData;
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
