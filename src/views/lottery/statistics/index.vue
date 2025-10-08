<template>
  <div class="lottery-statistics-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">彩票统计分析</span>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-area">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select
              v-model="filterParams.lotteryType"
              placeholder="选择彩票类型"
              class="filter-select"
              @change="handleFilterChange"
            >
              <el-option
                v-for="type in lotteryTypes"
                :key="type.lotteryTypeEng"
                :label="type.lotteryType"
                :value="type.lotteryType"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="filterParams.purchasedPeriod"
              placeholder="购买期号"
              class="filter-input"
              @change="handlePeriodChange"
            />
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="filterParams.winningPeriod"
              placeholder="开奖期号"
              class="filter-input"
              @change="handlePeriodChange"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 图表区域 -->
      <div class="chart-container">
        <div v-if="loading" class="chart-loading">
          <el-skeleton :rows="6" animated />
        </div>
        <div v-else-if="statisticsData.length === 0" class="chart-empty">
          <el-empty description="暂无统计数据" />
        </div>
        <div v-else class="chart-wrapper">
          <canvas id="statisticsChart" ref="chartCanvas" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import Chart from "chart.js/auto";
import type { ConstsDto, StatisticsWinItemDto } from "@/types/business";
import { lotteryApi } from "@/api/lottery";

// 响应式数据
const loading = ref(false);
const lotteryTypes = ref<ConstsDto[]>([]);
const statisticsData = ref<StatisticsWinItemDto[]>([]);
const chartCanvas = ref<HTMLCanvasElement>();
let chart: Chart | null = null;

// 筛选参数
const filterParams = ref({
  lotteryType: "",
  purchasedPeriod: "",
  winningPeriod: ""
});

// 初始化数据
const initData = async () => {
  try {
    loading.value = true;
    // 获取彩票类型
    const consts = await lotteryApi.getLotteryConsts();
    lotteryTypes.value = Array.isArray(consts) ? consts : [];

    if (lotteryTypes.value.length > 0) {
      filterParams.value.lotteryType = lotteryTypes.value[0].lotteryType;
    }

    // 获取统计数据
    await updateChart();
  } catch (error) {
    console.error("初始化数据失败:", error);
    ElMessage.error("初始化数据失败");
  } finally {
    loading.value = false;
  }
};

// 处理期号变化
const handlePeriodChange = () => {
  const { purchasedPeriod, winningPeriod } = filterParams.value;

  if (isValidString(purchasedPeriod) && !isValidString(winningPeriod)) {
    filterParams.value.winningPeriod = purchasedPeriod;
  }

  if (isValidString(winningPeriod) && !isValidString(purchasedPeriod)) {
    filterParams.value.purchasedPeriod = winningPeriod;
  }

  updateChart();
};

// 处理筛选变化
const handleFilterChange = () => {
  updateChart();
};

// 更新图表
const updateChart = async () => {
  try {
    const { purchasedPeriod, winningPeriod, lotteryType } = filterParams.value;

    const data = await lotteryApi.getStatisticsWin(
      purchasedPeriod,
      winningPeriod,
      lotteryType
    );

    statisticsData.value = Array.isArray(data) ? data : [];

    await nextTick();
    renderChart();
  } catch (error) {
    console.error("获取统计数据失败:", error);
    ElMessage.error("获取统计数据失败");
    statisticsData.value = [];
  }
};

// 渲染图表
const renderChart = () => {
  if (!chartCanvas.value || statisticsData.value.length === 0) {
    return;
  }

  // 销毁现有图表
  if (chart) {
    chart.destroy();
  }

  const labels = statisticsData.value.map(item => item.code);
  const buyData = statisticsData.value.map(item => item.buyAmount);
  const winData = statisticsData.value.map(item => item.winAmount);

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "购买金额",
          data: buyData,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        },
        {
          label: "中奖金额",
          data: winData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "金额"
          }
        },
        x: {
          title: {
            display: true,
            text: "期号"
          }
        }
      },
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: "彩票购买与中奖金额统计"
        }
      }
    }
  });
};

// 验证字符串是否有效
const isValidString = (str: string): boolean => {
  return str !== null && str !== undefined && str.trim() !== "";
};

// 组件挂载时初始化
onMounted(() => {
  initData();
});

// 组件卸载时清理
onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.lottery-statistics-container {
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

.filter-area {
  margin-bottom: 20px;
}

.filter-select,
.filter-input {
  width: 100%;
}

.chart-container {
  position: relative;
  height: 70vh;
  margin-top: 20px;
}

.chart-loading,
.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
