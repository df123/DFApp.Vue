<template>
  <div class="external-link-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">外部链接管理</span>
        </div>
      </template>

      <!-- 外部链接管理区域 -->
      <div class="link-content">
        <el-alert
          title="外部链接管理功能正在开发中"
          type="info"
          description="此页面将提供Telegram外部链接的管理功能"
          show-icon
          :closable="false"
        />

        <div class="placeholder-link">
          <el-empty description="外部链接管理区域" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 外部链接管理组件 - 待实现
</script>

<style scoped>
.external-link-container {
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

.link-content {
  margin-top: 20px;
}

.placeholder-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  margin-top: 20px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
