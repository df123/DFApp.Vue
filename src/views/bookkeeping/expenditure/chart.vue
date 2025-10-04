<template>
  <div class="expenditure-chart-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">支出图表</span>
        </div>
      </template>

      <!-- 图表区域 -->
      <div class="chart-content">
        <el-alert
          title="支出图表功能正在开发中"
          type="info"
          description="此页面将展示支出数据的可视化图表，包括柱状图、饼图、折线图等"
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
// 支出图表组件 - 待实现
</script>

<style scoped>
.expenditure-chart-container {
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

.chart-content {
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
