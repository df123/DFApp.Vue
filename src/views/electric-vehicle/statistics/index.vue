<template>
  <div class="statistics-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">统计分析</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic
              title="电车总花费"
              :value="data?.electricVehicleTotalCost?.toFixed(2)"
              prefix="￥"
            />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic
              title="电车行驶里程"
              :value="data?.electricVehicleMileage?.toFixed(0)"
              suffix="km"
            />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic
              title="电车每公里成本"
              :value="data?.electricVehicleCostPerKm?.toFixed(3)"
              prefix="￥"
            />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic
              title="节省金额"
              :value="data?.savings?.toFixed(2)"
              prefix="￥"
              :value-style="{ color: '#67C23A' }"
            />
          </el-card>
        </el-col>
      </el-row>

      <el-divider>成本对比图表</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span class="card-title">油电成本对比</span>
            </template>
            <div ref="comparisonChartRef" style="width: 100%; height: 400px" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span class="card-title">成本构成分析</span>
            </template>
            <div
              ref="costBreakdownChartRef"
              style="width: 100%; height: 400px"
            />
          </el-card>
        </el-col>
      </el-row>

      <el-divider>油电对比分析</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span class="card-title">电车成本明细</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="充电费用">
                ￥{{ data?.electricChargingCost?.toFixed(2) }}
              </el-descriptions-item>
              <el-descriptions-item label="其他费用">
                ￥{{ data?.electricOtherCost?.toFixed(2) }}
              </el-descriptions-item>
              <el-descriptions-item label="每公里成本">
                ￥{{ data?.electricVehicleCostPerKm?.toFixed(3) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span class="card-title">油车成本（相同里程）</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="油费">
                ￥{{ data?.oilVehicleFuelCost?.toFixed(2) }}
              </el-descriptions-item>
              <el-descriptions-item label="每公里成本">
                ￥{{ data?.oilVehicleCostPerKm?.toFixed(3) }}
              </el-descriptions-item>
              <el-descriptions-item label="总花费">
                ￥{{ data?.oilVehicleTotalCost?.toFixed(2) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <el-divider>油车参数</el-divider>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="省份">
          {{ data?.province }}
        </el-descriptions-item>
        <el-descriptions-item label="汽油标号">
          {{ data?.gasolineGrade }}号
        </el-descriptions-item>
        <el-descriptions-item label="百公里油耗">
          {{ data?.fuelConsumption }}升
        </el-descriptions-item>
        <el-descriptions-item label="当前油价">
          ￥{{ data?.currentGasolinePrice?.toFixed(2) }}/升
        </el-descriptions-item>
      </el-descriptions>

      <el-result
        icon="success"
        :title="`节省 ￥${data?.savings?.toFixed(2)}`"
        :sub-title="`节省比例：${data?.savingsPercentage?.toFixed(1)}%`"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { electricVehicleCostApi } from "@/api/electric-vehicle";
import type { OilCostComparisonDto } from "@/types/api";
import * as echarts from "echarts";

const data = ref<OilCostComparisonDto | null>(null);
const loading = ref(false);

const comparisonChartRef = ref<HTMLElement | null>(null);
const costBreakdownChartRef = ref<HTMLElement | null>(null);
let comparisonChartInstance: echarts.ECharts | null = null;
let costBreakdownChartInstance: echarts.ECharts | null = null;

const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

const loadData = async () => {
  loading.value = true;
  try {
    data.value = await electricVehicleCostApi.getOilCostComparison({
      startDate: thirtyDaysAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0]
    });
  } catch (error) {
    console.error("加载对比数据失败:", error);
  } finally {
    loading.value = false;
  }
};

const initCharts = () => {
  if (!data.value) return;

  if (comparisonChartRef.value) {
    comparisonChartInstance = echarts.init(comparisonChartRef.value);
  }
  if (costBreakdownChartRef.value) {
    costBreakdownChartInstance = echarts.init(costBreakdownChartRef.value);
  }

  const comparisonOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      data: ["电车", "油车"]
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["总成本", "每公里成本"]
    },
    yAxis: {
      type: "value",
      name: "成本（元）"
    },
    series: [
      {
        name: "电车",
        type: "bar",
        data: [
          data.value.electricVehicleTotalCost || 0,
          data.value.electricVehicleCostPerKm || 0
        ],
        itemStyle: {
          color: "#67C23A"
        }
      },
      {
        name: "油车",
        type: "bar",
        data: [
          data.value.oilVehicleTotalCost || 0,
          data.value.oilVehicleCostPerKm || 0
        ],
        itemStyle: {
          color: "#F56C6C"
        }
      }
    ]
  };

  const breakdownOption = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} 元"
    },
    legend: {
      orient: "vertical",
      left: "left"
    },
    series: [
      {
        name: "电车成本构成",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: "{b}: {c}元 ({d}%)"
        },
        labelLine: {
          show: true
        },
        data: [
          {
            value: data.value.electricChargingCost || 0,
            name: "充电费用",
            itemStyle: { color: "#91CC75" }
          },
          {
            value: data.value.electricOtherCost || 0,
            name: "其他费用",
            itemStyle: { color: "#FAC858" }
          }
        ]
      }
    ]
  };

  if (comparisonChartInstance) {
    comparisonChartInstance.setOption(comparisonOption);
  }
  if (costBreakdownChartInstance) {
    costBreakdownChartInstance.setOption(breakdownOption);
  }

  window.addEventListener("resize", handleResize);
};

const handleResize = () => {
  comparisonChartInstance?.resize();
  costBreakdownChartInstance?.resize();
};

onMounted(() => {
  loadData();
  setTimeout(() => {
    initCharts();
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  comparisonChartInstance?.dispose();
  costBreakdownChartInstance?.dispose();
});
</script>

<style scoped>
.statistics-container {
  padding: 20px;
}

.stat-card {
  text-align: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}
</style>
