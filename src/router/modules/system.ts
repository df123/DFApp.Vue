export default {
  path: "/system",
  name: "System",
  redirect: "/system/configuration",
  component: () => import("@/views/system/index.vue"),
  meta: {
    title: "系统管理",
    icon: "ep:setting",
    rank: 5
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
      path: "/system/permission-management",
      name: "PermissionManagement",
      component: () => import("@/views/permission/management/index.vue"),
      meta: {
        title: "权限管理"
      }
    },
    {
      path: "/system/aria2",
      name: "Aria2",
      redirect: "/system/aria2/manage",
      component: () => import("@/views/aria2/index.vue"),
      meta: {
        title: "Aria2 管理",
        icon: "ep:download"
      },
      children: [
        {
          path: "/system/aria2/manage",
          name: "Aria2Manage",
          component: () => import("@/views/aria2/manage.vue"),
          meta: {
            title: "下载管理"
          }
        }
      ]
    }
  ]
} satisfies RouteConfigsTable;
