import type { RouteRecordRaw } from "vue-router";

const telegram: RouteRecordRaw = {
  path: "/telegram",
  name: "Telegram",
  component: () => import("@/views/telegram/index.vue"),
  meta: {
    title: "Telegram管理",
    icon: "ep:message",
    alwaysShow: true
  },
  children: [
    {
      path: "login",
      name: "TGLogin",
      component: () => import("@/views/telegram/login/index.vue"),
      meta: {
        title: "TG登录"
      }
    },
    {
      path: "media",
      name: "Media",
      component: () => import("@/views/telegram/media/index.vue"),
      meta: {
        title: "媒体管理"
      }
    },
    {
      path: "media/chart",
      name: "MediaChart",
      component: () => import("@/views/telegram/media/chart.vue"),
      meta: {
        title: "媒体图表"
      }
    },
    {
      path: "media/externalLink",
      name: "ExternalLink",
      component: () => import("@/views/telegram/media/externalLink.vue"),
      meta: {
        title: "外部链接管理"
      }
    }
  ]
};

export default telegram;
