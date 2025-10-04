<template>
  <div class="expenditure-analysis-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">支出分析</span>
        </div>
      </template>

      <!-- 分析图表区域 -->
      <div class="analysis-content">
        <el-alert
          title="支出分析功能正在开发中"
          type="info"
          description="此页面将展示支出数据的图表分析，包括月度趋势、分类占比等统计信息"
          show-icon
          :closable="false"
        />

        <div class="placeholder-chart">
          <el-empty description="图表区域" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 支出分析组件 - 待实现
</script>

<style scoped>
.expenditure-analysis-container {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.analysis-content {
  margin-top: 20px;
}

.placeholder-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  margin-top: 20px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
