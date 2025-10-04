import type { RouteRecordRaw } from "vue-router";

const bookkeeping: RouteRecordRaw = {
  path: "/bookkeeping",
  name: "Bookkeeping",
  component: () => import("@/views/bookkeeping/index.vue"),
  meta: {
    title: "记账管理",
    icon: "ep:receipt",
    alwaysShow: true
  },
  children: [
    {
      path: "expenditure",
      name: "Expenditure",
      component: () => import("@/views/bookkeeping/expenditure/index.vue"),
      meta: {
        title: "支出管理"
      }
    },
    {
      path: "expenditure/analysis",
      name: "ExpenditureAnalysis",
      component: () => import("@/views/bookkeeping/expenditure/analysis.vue"),
      meta: {
        title: "支出分析"
      }
    },
    {
      path: "expenditure/chart",
      name: "ExpenditureChart",
      component: () => import("@/views/bookkeeping/expenditure/chart.vue"),
      meta: {
        title: "支出图表"
      }
    },
    {
      path: "category",
      name: "Category",
      component: () => import("@/views/bookkeeping/category/index.vue"),
      meta: {
        title: "分类管理"
      }
    }
  ]
};

export default bookkeeping;
