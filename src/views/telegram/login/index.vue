<template>
  <div class="tg-login-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">TG登录</span>
        </div>
      </template>

      <!-- TG登录区域 -->
      <div class="login-content">
        <el-alert
          title="TG登录功能正在开发中"
          type="info"
          description="此页面将提供Telegram登录状态检查和配置管理功能"
          show-icon
          :closable="false"
        />

        <div class="placeholder-login">
          <el-empty description="TG登录区域" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// TG登录组件 - 待实现
</script>

<style scoped>
.tg-login-container {
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

.login-content {
  margin-top: 20px;
}

.placeholder-login {
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
