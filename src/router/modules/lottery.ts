import type { RouteRecordRaw } from "vue-router";

const lottery: RouteRecordRaw = {
  path: "/lottery",
  name: "Lottery",
  meta: {
    title: "彩票管理",
    icon: "ep:pie-chart",
    alwaysShow: true
  },
  children: [
    {
      path: "buy",
      name: "LotteryBuy",
      component: () => import("@/views/lottery/index.vue"),
      meta: {
        title: "彩票购买"
      }
    },
    {
      path: "result",
      name: "LotteryResult",
      component: () => import("@/views/lottery/result/index.vue"),
      meta: {
        title: "开奖结果"
      }
    },
    {
      path: "statistics",
      name: "LotteryStatistics",
      component: () => import("@/views/lottery/statistics/index.vue"),
      meta: {
        title: "统计分析"
      }
    },
    {
      path: "statistics-item",
      name: "LotteryStatisticsItem",
      component: () => import("@/views/lottery/statistics-item/index.vue"),
      meta: {
        title: "统计项管理"
      }
    },
    {
      path: "simulation/ssq",
      name: "LotterySimulation",
      component: () => import("@/views/lottery/simulation/ssq/index.vue"),
      meta: {
        title: "双色球模拟"
      }
    },
    {
      path: "simulation/kl8",
      name: "LotteryK8",
      component: () => import("@/views/lottery/simulation/kl8/index.vue"),
      meta: {
        title: "快乐8模拟"
      }
    }
  ]
};

export default lottery;
