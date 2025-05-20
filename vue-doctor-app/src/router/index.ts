import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import DoctorAppLayout from '@/components/layout/DoctorAppLayout.vue';
import DoctorDashboardView from '@/views/DoctorDashboardView.vue';

const VUE_DOCTOR_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-doctor-app/';

// Helper to generate dashboard child routes from nav links
import { doctorNavLinksVue } from '@/lib/nav-links-vue-doctor';

const createPlaceholderView = (title: string) => ({
  name: title.replace(/\s+/g, '') + 'View', // Ensure unique name
  template: `<div class="p-4"><h1 class="text-2xl font-semibold text-primary mb-4">${title}</h1><p class="text-muted-foreground">此页面 (${title}) 正在建设中。</p></div>`,
  meta: { title }
});

const dashboardChildRoutes: Array<RouteRecordRaw> = doctorNavLinksVue
  .filter(link => link.href.startsWith(VUE_DOCTOR_APP_BASE_URL + 'dashboard/')) // Filter only actual sub-pages of dashboard
  .map(link => {
    const pathSegment = link.href.substring((VUE_DOCTOR_APP_BASE_URL + 'dashboard/').length);
    return {
      path: pathSegment, 
      name: link.title.replace(/\s+/g, '') + 'View', // Use a consistent naming convention
      component: createPlaceholderView(link.title), // Use the placeholder component
      meta: { title: link.title }
    };
  });
  
// Ensure the base dashboard route itself is added
dashboardChildRoutes.unshift({
  path: '', // Empty path for /vue-doctor-app/dashboard
  name: 'DoctorDashboardHome',
  component: DoctorDashboardView,
  meta: { title: '医生仪表盘' }
});


const routes: Array<RouteRecordRaw> = [
  {
    path: VUE_DOCTOR_APP_BASE_URL, // Matches /vue-doctor-app/
    component: DoctorAppLayout,
    redirect: VUE_DOCTOR_APP_BASE_URL + 'dashboard', // Redirects /vue-doctor-app/ to /vue-doctor-app/dashboard
    children: [
      {
        path: 'dashboard', // Relative to parent, so it's /vue-doctor-app/dashboard
        // component: DoctorDashboardView, // This could be a wrapper if dashboard has its own sub-layout
        component: { template: '<router-view />' }, // Simple wrapper for nested routes
        redirect: VUE_DOCTOR_APP_BASE_URL + 'dashboard/', // Redirects /vue-doctor-app/dashboard to /vue-doctor-app/dashboard/ (for the home child route)
        children: dashboardChildRoutes,
        meta: { title: '医生仪表盘' } // This title might be overridden by children
      }
    ]
  },
  // Add login/auth routes here if needed, for now redirecting to dashboard
  {
    path: VUE_DOCTOR_APP_BASE_URL + 'auth/login',
    name: 'DoctorLogin',
    // component: () => import('@/views/DoctorLoginView.vue'), // Placeholder for login
    redirect: VUE_DOCTOR_APP_BASE_URL + 'dashboard', // For now, redirect
    meta: { title: '医生登录' }
  },
  // Catch-all for any path not matched within the app
  { 
    path: '/:pathMatch(.*)*', 
    redirect: VUE_DOCTOR_APP_BASE_URL + 'dashboard' // Redirect unmatched paths to dashboard home
  }
];

const router = createRouter({
  history: createWebHistory(), // Vite handles the base in its config for dev, Next.js handles it via rewrites for prod
  routes,
});

router.afterEach((to) => {
  const baseTitle = 'AI慢病管理 - 医生端 (Vue)';
  if (to.meta && to.meta.title) {
    document.title = `${baseTitle} - ${to.meta.title as string}`;
  } else {
    document.title = baseTitle;
  }
});

export default router;
