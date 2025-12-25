export default {
  path: "/system",
  name: "System",
  redirect: "/system/configuration",
  component: () => import("@/views/system/index.vue"),
  meta: {
    title: "系统管理",
    icon: "ep:setting",
    rank: 4
  },
  children: [
    {
      path: "/system/configuration",
      name: "Configuration",
      component: () => import("@/views/configuration/index.vue"),
      meta: {
        title: "配置管理"
      }
    },
    {
      path: "/system/dynamicIp",
      name: "DynamicIp",
      component: () => import("@/views/dynamicIp/index.vue"),
      meta: {
        title: "动态IP管理"
      }
    },
    {
      path: "/system/fileUpload",
      name: "FileUpload",
      component: () => import("@/views/fileUpload/index.vue"),
      meta: {
        title: "文件上传管理"
      }
    },
    {
      path: "/system/logViewer",
      name: "LogViewer",
      component: () => import("@/views/logViewer/index.vue"),
      meta: {
        title: "日志查看器"
      }
    },
    {
      path: "/system/aria2",
      name: "Aria2",
      component: () => import("@/views/aria2/index.vue"),
      meta: {
        title: "Aria2管理"
      }
    },
    {
      path: "/system/rss",
      name: "Rss",
      component: () => import("@/views/rss/index.vue"),
      meta: {
        title: "RSS阅读器"
      }
    },
    {
      path: "/system/filterKeyword",
      name: "FilterKeyword",
      component: () => import("@/views/filterKeyword/index.vue"),
      meta: {
        title: "关键词过滤管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
