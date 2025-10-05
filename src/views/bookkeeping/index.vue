<template>
  <div class="bookkeeping-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">记账管理</span>
        </div>
      </template>

      <div class="welcome-content">
        <el-alert
          title="欢迎使用记账管理系统"
          type="info"
          description="请从左侧菜单选择具体功能模块"
          show-icon
          :closable="false"
        />

        <div class="feature-grid">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover" class="feature-card">
                <template #header>
                  <div class="feature-header">
                    <el-icon><Document /></el-icon>
                    <span>支出管理</span>
                  </div>
                </template>
                <div class="feature-description">
                  记录和管理日常支出，支持分类、日期筛选等功能
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" class="feature-card">
                <template #header>
                  <div class="feature-header">
                    <el-icon><PieChart /></el-icon>
                    <span>支出分析</span>
                  </div>
                </template>
                <div class="feature-description">
                  通过图表分析支出数据，了解消费趋势和分类占比
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" class="feature-card">
                <template #header>
                  <div class="feature-header">
                    <el-icon><FolderOpened /></el-icon>
                    <span>分类管理</span>
                  </div>
                </template>
                <div class="feature-description">
                  管理支出分类，自定义分类名称和排序
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Document, PieChart, FolderOpened } from "@element-plus/icons-vue";
</script>

<style scoped>
.bookkeeping-container {
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

.welcome-content {
  margin-top: 20px;
}

.feature-grid {
  margin-top: 30px;
}

.feature-card {
  height: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transform: translateY(-5px);
}

.feature-header {
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
}

.feature-description {
  font-size: 14px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
</style>
