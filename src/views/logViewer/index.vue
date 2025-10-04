<template>
  <div class="log-viewer-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">日志查看器</span>
        </div>
      </template>

      <!-- 日志查看区域 -->
      <div class="log-content">
        <el-alert
          title="日志查看器功能正在开发中"
          type="info"
          description="此页面将展示系统日志信息，支持实时日志推送、日志过滤和搜索功能"
          show-icon
          :closable="false"
        />

        <div class="placeholder-log">
          <el-empty description="日志显示区域" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 日志查看器组件 - 待实现
</script>

<style scoped>
.log-viewer-container {
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

.log-content {
  margin-top: 20px;
}

.placeholder-log {
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
