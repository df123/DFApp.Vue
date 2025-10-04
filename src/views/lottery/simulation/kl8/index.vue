<template>
  <div class="kl8-simulation-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">快乐8模拟</span>
        </div>
      </template>

      <!-- 快乐8模拟区域 -->
      <div class="simulation-content">
        <el-alert
          title="快乐8模拟功能正在开发中"
          type="info"
          description="此页面将提供快乐8号码生成、模拟投注和结果分析功能"
          show-icon
          :closable="false"
        />

        <div class="placeholder-simulation">
          <el-empty description="快乐8模拟区域" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 快乐8模拟组件 - 待实现
</script>

<style scoped>
.kl8-simulation-container {
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

.simulation-content {
  margin-top: 20px;
}

.placeholder-simulation {
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
