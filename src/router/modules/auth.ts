const authRoutes = [
  {
    path: "/auth",
    name: "Auth",
    redirect: "/auth/callback",
    meta: {
      title: "认证",
      hideMenu: true
    },
    children: [
      {
        path: "callback",
        name: "Callback",
        component: () => import("@/views/auth/callback.vue"),
        meta: {
          title: "回调",
          hideMenu: true
        }
      },
      {
        path: "silent-callback",
        name: "SilentCallback",
        component: () => import("@/views/auth/silent-callback.vue"),
        meta: {
          title: "静默回调",
          hideMenu: true
        }
      }
    ]
  }
];

export default authRoutes;
