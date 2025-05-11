import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import MobileAppLayout from '@/components/layout/MobileAppLayout.vue'

// Patient dashboard routes, all nested under MobileAppLayout
const dashboardRoutes = [
  { path: '', name: 'DashboardHome', component: DashboardView },
  // Add other dashboard pages here, e.g.:
  // { path: 'health-data', name: 'HealthData', component: () => import('@/views/HealthDataView.vue') },
  // { path: 'nutrition', name: 'Nutrition', component: () => import('@/views/NutritionView.vue') },
  // { path: 'reports', name: 'Reports', component: () => import('@/views/ReportsView.vue') },
  // { path: 'consultations', name: 'Consultations', component: () => import('@/views/ConsultationsView.vue') },
  // { path: 'assistant', name: 'Assistant', component: () => import('@/views/AssistantView.vue') },
  // { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileView.vue') },
  // { path: 'settings', name: 'Settings', component: () => import('@/views/SettingsView.vue') },
  // { path: 'help', name: 'Help', component: () => import('@/views/HelpView.vue') },
  // { path: 'reminders', name: 'Reminders', component: () => import('@/views/RemindersView.vue') },
  // { path: 'health-courses', name: 'HealthCourses', component: () => import('@/views/HealthCoursesView.vue') },
  // { path: 'community', name: 'Community', component: () => import('@/views/CommunityView.vue') },
  // { path: 'treatment', name: 'Treatment', component: () => import('@/views/TreatmentView.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard', // Or '/auth/login' if login is required first
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/auth/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      component: MobileAppLayout,
      children: dashboardRoutes,
      // meta: { requiresAuth: true } // Example for auth guard
    },
    // Fallback route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue') // Create this view
    }
  ],
})

// Example navigation guard (optional)
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('user-token'); // Example auth check
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

export default router
