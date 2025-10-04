<template>
  <div class="media-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">媒体管理</span>
        </div>
      </template>

      <!-- 媒体管理区域 -->
      <div class="media-content">
        <el-alert
          title="媒体管理功能正在开发中"
          type="info"
          description="此页面将提供Telegram媒体文件的管理功能"
          show-icon
          :closable="false"
        />

        <div class="placeholder-media">
          <el-empty description="媒体管理区域" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 媒体管理组件 - 待实现
</script>

<style scoped>
.media-container {
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

.media-content {
  margin-top: 20px;
}

.placeholder-media {
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
