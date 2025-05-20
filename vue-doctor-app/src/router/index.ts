import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import DoctorAppLayout from '@/components/layout/DoctorAppLayout.vue';
import DoctorDashboardView from '@/views/DoctorDashboardView.vue';
// Import other views as they are created
// e.g., import PatientManagementView from '@/views/PatientManagementView.vue';

const VUE_DOCTOR_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-doctor-app/';

const dashboardChildRoutes: Array<RouteRecordRaw> = [
  { 
    path: '', // Base for dashboard, e.g., /vue-doctor-app/
    name: 'DoctorDashboardHome', 
    component: DoctorDashboardView, 
    meta: { title: '医生仪表盘' } 
  },
  // { 
  //   path: 'patients', 
  //   name: 'PatientManagement', 
  //   component: () => import('@/views/PatientManagementView.vue'), // Lazy load
  //   meta: { title: '病人管理' } 
  // },
  // Add other doctor-specific routes here
];

const routes: Array<RouteRecordRaw> = [
  {
    path: VUE_DOCTOR_APP_BASE_URL,
    component: DoctorAppLayout,
    redirect: `${VUE_DOCTOR_APP_BASE_URL.replace(/\/$/, "")}/dashboard`, // Redirect base to dashboard
    children: [
      {
        path: 'dashboard', // Relative to parent, so becomes /vue-doctor-app/dashboard
        component: DoctorDashboardView, // Or a wrapper component for dashboard children
        // children: dashboardChildRoutes, // If DoctorDashboardView is a layout for further nesting
        meta: { title: '医生仪表盘' }
      },
      // Add other top-level doctor routes here if they don't use DoctorAppLayout
      // Or, more commonly, make them children of DoctorAppLayout like 'dashboard'
    ]
  },
  // Add login/auth routes if needed, outside DoctorAppLayout
  // {
  //   path: `${VUE_DOCTOR_APP_BASE_URL}auth/login`,
  //   name: 'DoctorLogin',
  //   component: () => import('@/views/DoctorLoginView.vue'),
  //   meta: { title: '医生登录' }
  // },
  { 
    path: '/:pathMatch(.*)*', // Catch-all for any path not matched within the app
    redirect: VUE_DOCTOR_APP_BASE_URL 
  }
];

const router = createRouter({
  history: createWebHistory(), // createWebHistory() will use the `base` from vite.config.ts
  routes,
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = `AI慢病管理 - ${to.meta.title as string}`;
  } else {
    document.title = 'AI慢病管理系统 - 医生端 (Vue)';
  }
});

export default router;
