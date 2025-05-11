import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MobileAppLayout from '@/components/layout/MobileAppLayout.vue'

// Patient dashboard routes, all nested under MobileAppLayout
const dashboardRoutes = [
  { path: '', name: 'DashboardHome', component: () => import('@/views/DashboardView.vue'), meta: { title: '仪表盘' } },
  { path: 'health-data', name: 'HealthData', component: () => import('@/views/HealthDataView.vue'), meta: { title: '健康数据' } },
  { path: 'nutrition', name: 'Nutrition', component: () => import('@/views/NutritionView.vue'), meta: { title: '饮食记录' } },
  { path: 'reports', name: 'Reports', component: () => import('@/views/ReportsView.vue'), meta: { title: '检查报告' } },
  { path: 'treatment', name: 'Treatment', component: () => import('@/views/TreatmentView.vue'), meta: { title: '治疗方案' } },
  { path: 'consultations', name: 'Consultations', component: () => import('@/views/ConsultationsView.vue'), meta: { title: '医生咨询' } },
  { path: 'assistant', name: 'Assistant', component: () => import('@/views/AssistantView.vue'), meta: { title: 'AI小助手' } },
  { path: 'reminders', name: 'Reminders', component: () => import('@/views/RemindersView.vue'), meta: { title: '健康提醒' } },
  { path: 'health-courses', name: 'HealthCourses', component: () => import('@/views/HealthCoursesView.vue'), meta: { title: '健康课程' } },
  { path: 'community', name: 'Community', component: () => import('@/views/CommunityView.vue'), meta: { title: '社区互动' } },
  { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileView.vue'), meta: { title: '我的' } },
  { path: 'profile/edit-details', name: 'EditProfileDetails', component: () => import('@/views/EditProfileDetailsView.vue'), meta: { title: '编辑资料' } },
  { path: 'settings', name: 'Settings', component: () => import('@/views/SettingsView.vue'), meta: { title: '系统设置' } },
  { path: 'help', name: 'Help', component: () => import('@/views/HelpView.vue'), meta: { title: '帮助与支持' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // BASE_URL should be '/vue-patient-app/'
  routes: [
    {
      path: '/', // This will be relative to the base: /vue-patient-app/
      redirect: '/dashboard', 
    },
    {
      path: '/auth/login', // Actual path: /vue-patient-app/auth/login
      name: 'Login',
      component: LoginView,
       meta: { title: '登录' }
    },
    {
      path: '/auth/register', // Actual path: /vue-patient-app/auth/register
      name: 'Register',
      component: RegisterView,
      meta: { title: '注册' }
    },
    {
      path: '/dashboard', // Actual path: /vue-patient-app/dashboard
      component: MobileAppLayout,
      children: dashboardRoutes,
      // meta: { requiresAuth: true } // Example for auth guard
    },
    // Fallback route for 404 within the Vue app's base
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '页面未找到' }
    }
  ],
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = `AI慢病管理 - ${to.meta.title}`;
  } else {
    document.title = 'AI慢病管理系统 - 病人端 (Vue)';
  }
});

export default router
