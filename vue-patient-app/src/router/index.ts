import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MobileAppLayout from '@/components/layout/MobileAppLayout.vue';
import { navLinksVue } from '@/lib/nav-links-vue';
import { useAuthStore } from '@/stores/authStore';

const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';

const createPlaceholderView = (title: string) => ({
  name: title.replace(/\s+/g, '') + 'View',
  template: `<div class="p-4"><h1 class="text-xl font-semibold text-primary mb-2">${title}</h1><p class="text-muted-foreground text-sm">此页面 (${title}) 正在建设中，敬请期待！</p></div>`,
  meta: { title }
});

const dashboardChildRoutes: Array<RouteRecordRaw> = navLinksVue
  .filter(link => link.href.startsWith(VUE_APP_BASE_URL + 'dashboard/'))
  .map(link => {
    const pathSegment = link.href.substring((VUE_APP_BASE_URL + 'dashboard/').length);
    // For /dashboard itself, path is empty
    if (link.href === VUE_APP_BASE_URL + 'dashboard') {
      return {
        path: '', // Empty path for /vue-patient-app/dashboard
        name: 'DashboardHome',
        component: () => import('@/views/DashboardView.vue'), // Actual component
        meta: { title: link.title }
      };
    }
    return {
      path: pathSegment,
      name: link.title.replace(/\s+/g, '') + 'View',
      component: () => import(`@/views/${link.title.replace(/\s+/g, '')}View.vue`).catch(() => createPlaceholderView(link.title)),
      meta: { title: link.title }
    };
  });

const routes: Array<RouteRecordRaw> = [
  {
    path: VUE_APP_BASE_URL,
    redirect: `${VUE_APP_BASE_URL}dashboard`, // Default redirect to dashboard
  },
  {
    path: `${VUE_APP_BASE_URL}auth/login`,
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录' }
  },
  {
    path: `${VUE_APP_BASE_URL}auth/register`,
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '注册' }
  },
  {
    path: `${VUE_APP_BASE_URL}dashboard`,
    component: MobileAppLayout,
    children: dashboardChildRoutes,
    meta: { requiresAuth: false } // Set to true when auth is implemented
  },
  {
    path: `${VUE_APP_BASE_URL}:pathMatch(.*)*`,
    name: 'VueAppNotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面未找到' }
  },
   {
    path: '/:pathMatch(.*)*', // Catch-all for paths outside VUE_APP_BASE_URL
    redirect: `${VUE_APP_BASE_URL}404` // Redirect to a path caught by the above rule
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Basic auth guard example
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next({ name: 'Login', query: { redirect: to.fullPath } });
  // } else {
  //   next();
  // }
  next(); // For now, allow all routes
});


router.afterEach((to) => {
  const defaultTitle = 'AI慢病管理系统 - 病人端 (Vue)';
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title as string} - ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }
});

export default router;
