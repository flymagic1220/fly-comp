import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordSingleView } from "vue-router";
import { pages } from "@/utils/auto";

const myRoutes: RouteRecordSingleView[] = Object.keys(pages).map((path) => {
  const name = path.split("/").pop()?.replace(".vue", "");
  return {
    path: `/${name}`,
    name,
    component: pages[path]!,
  };
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: () => import("@/layout/layout-main.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/app-home.vue"),
        },
        {
          path: "/tj-transfer",
          name: "transfer",
          component: () => import("@/views/tj-transfer.vue"),
        },
        // {
        //   path: '/request-page',
        //   name: 'request-page',
        //   component: () => import('@/views/request-page.vue'),
        // },
      ],
    },
  ],
});

myRoutes.forEach((route) => {
  router.addRoute("layout", route);
});

export default router;
