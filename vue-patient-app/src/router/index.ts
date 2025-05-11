import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import MobileAppLayout from '@/components/layout/MobileAppLayout.vue';
import DashboardView from '@/views/DashboardView.vue';
import HealthDataView from '@/views/HealthDataView.vue';
import NutritionView from '@/views/NutritionView.vue';
import ReportsView from '@/views/ReportsView.vue';
import TreatmentView from '@/views/TreatmentView.vue';
import ConsultationsView from '@/views/ConsultationsView.vue';
import AssistantView from '@/views/AssistantView.vue';
import RemindersView from '@/views/RemindersView.vue';
import HealthCoursesView from '@/views/HealthCoursesView.vue';
import CommunityView from '@/views/CommunityView.vue';
import ProfileView from '@/views/ProfileView.vue';
import EditProfileDetailsView from '@/views/EditProfileDetailsView.vue';
import SettingsView from '@/views/SettingsView.vue';
import HelpView from '@/views/HelpView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const VUE_APP_BASE_URL = import.meta.env.BASE_URL || '/vue-patient-app/';

const dashboardChildRoutes: Array<RouteRecordRaw> = [
  { path: '', name: 'DashboardHome', component: DashboardView, meta: { title: '仪表盘' } },
  { path: 'health-data', name: 'HealthData', component: HealthDataView, meta: { title: '健康数据' } },
  { path: 'nutrition', name: 'Nutrition', component: NutritionView, meta: { title: '饮食记录' } },
  { path: 'reports', name: 'Reports', component: ReportsView, meta: { title: '检查报告' } },
  { path: 'treatment', name: 'Treatment', component: TreatmentView, meta: { title: '治疗方案' } },
  { path: 'consultations', name: 'Consultations', component: ConsultationsView, meta: { title: '医生咨询' } },
  { path: 'assistant', name: 'Assistant', component: AssistantView, meta: { title: 'AI小助手' } },
  { path: 'reminders', name: 'Reminders', component: RemindersView, meta: { title: '健康提醒' } },
  { path: 'health-courses', name: 'HealthCourses', component: HealthCoursesView, meta: { title: '健康课程' } },
  { path: 'community', name: 'Community', component: CommunityView, meta: { title: '社区互动' } },
  { path: 'profile', name: 'Profile', component: ProfileView, meta: { title: '我的' } },
  { path: 'profile/edit-details', name: 'EditProfileDetails', component: EditProfileDetailsView, meta: { title: '编辑资料' } },
  { path: 'settings', name: 'Settings', component: SettingsView, meta: { title: '系统设置' } },
  { path: 'help', name: 'Help', component: HelpView, meta: { title: '帮助与支持' } },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: VUE_APP_BASE_URL, 
    redirect: `${VUE_APP_BASE_URL}dashboard`,
  },
  {
    path: `${VUE_APP_BASE_URL}auth/login`,
    name: 'Login',
    component: LoginView,
    meta: { title: '登录' }
  },
  {
    path: `${VUE_APP_BASE_URL}auth/register`,
    name: 'Register',
    component: RegisterView,
    meta: { title: '注册' }
  },
  {
    path: `${VUE_APP_BASE_URL}dashboard`,
    component: MobileAppLayout,
    children: dashboardChildRoutes,
    // meta: { requiresAuth: true } // Example for auth guard
  },
  // Fallback route for 404 within the Vue app's base
  {
    path: `${VUE_APP_BASE_URL}:pathMatch(.*)*`,
    name: 'NotFoundInVueApp',
    component: NotFoundView,
    meta: { title: '页面未找到' }
  },
   // Catch-all for routes not under VUE_APP_BASE_URL, redirect to vue app's 404
  {
    path: '/:pathMatch(.*)*',
    redirect: `${VUE_APP_BASE_URL}not-found-external` // This will be caught by the above rule
  }
];

const router = createRouter({
  history: createWebHistory(), // Using createWebHistory without explicit base, paths are absolute
  routes,
});

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = `AI慢病管理 - ${to.meta.title}`;
  } else {
    document.title = 'AI慢病管理系统 - 病人端 (Vue)';
  }
});

export default router;
