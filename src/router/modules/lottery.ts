import type { RouteRecordRaw } from "vue-router";

const lottery: RouteRecordRaw = {
  path: "/lottery",
  name: "Lottery",
  component: () => import("@/views/lottery/index.vue"),
  meta: {
    title: "彩票管理",
    icon: "ep:pie-chart",
    alwaysShow: true
  },
  children: [
    {
      path: "lottery-data",
      name: "LotteryData",
      component: () => import("@/views/lottery/index.vue"),
      meta: {
        title: "彩票数据管理"
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
      path: "simulation/ssq",
      name: "SSQSimulation",
      component: () => import("@/views/lottery/simulation/ssq/index.vue"),
      meta: {
        title: "双色球模拟"
      }
    },
    {
      path: "simulation/kl8",
      name: "KL8Simulation",
      component: () => import("@/views/lottery/simulation/kl8/index.vue"),
      meta: {
        title: "快乐8模拟"
      }
    }
  ]
};

export default lottery;
