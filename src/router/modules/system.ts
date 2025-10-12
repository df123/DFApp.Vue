import type { RouteRecordRaw } from "vue-router";

const system: RouteRecordRaw = {
  path: "/system",
  name: "System",
  component: () => import("@/views/system/index.vue"),
  meta: {
    title: "系统管理",
    icon: "ep:setting",
    alwaysShow: true
  },
  children: [
    {
      path: "configuration",
      name: "Configuration",
      component: () => import("@/views/configuration/index.vue"),
      meta: {
        title: "配置管理"
      }
    },
    {
      path: "dynamicIp",
      name: "DynamicIp",
      component: () => import("@/views/dynamicIp/index.vue"),
      meta: {
        title: "动态IP管理"
      }
    },
    {
      path: "fileUpload",
      name: "FileUpload",
      component: () => import("@/views/fileUpload/index.vue"),
      meta: {
        title: "文件上传管理"
      }
    },
    {
      path: "logViewer",
      name: "LogViewer",
      component: () => import("@/views/logViewer/index.vue"),
      meta: {
        title: "日志查看器"
      }
    },
    {
      path: "aria2",
      name: "Aria2",
      component: () => import("@/views/aria2/index.vue"),
      meta: {
        title: "Aria2管理"
      }
    }
  ]
};

export default system;
