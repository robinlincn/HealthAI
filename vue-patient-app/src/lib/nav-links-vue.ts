import type { NavItemVue } from '@/lib/types-vue';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Apple,
  ClipboardList,
  MessageSquare,
  Settings,
  LineChart,
  BookOpen,
  Users,
  HelpCircle,
  BellRing,
  Bot,
  Pill, // Added Pill icon
} from 'lucide-vue-next';

export const navLinksVue: NavItemVue[] = [
  {
    title: '仪表盘',
    href: '/vue-patient-app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '健康数据',
    href: '/vue-patient-app/dashboard/health-data',
    icon: LineChart,
  },
  {
    title: '饮食记录',
    href: '/vue-patient-app/dashboard/nutrition',
    icon: Apple,
  },
  {
    title: '用药计划', // New Medication Plan link
    href: '/vue-patient-app/dashboard/medication-plan',
    icon: Pill,
  },
  {
    title: '检查报告',
    href: '/vue-patient-app/dashboard/reports',
    icon: FileText,
  },
  {
    title: '治疗方案',
    href: '/vue-patient-app/dashboard/treatment',
    icon: ClipboardList,
  },
  {
    title: '医生咨询',
    href: '/vue-patient-app/dashboard/consultations',
    icon: MessageSquare,
  },
  {
    title: 'AI小助手',
    href: '/vue-patient-app/dashboard/assistant',
    icon: Bot,
  },
  {
    title: '健康提醒',
    href: '/vue-patient-app/dashboard/reminders',
    icon: BellRing,
  },
  {
    title: '健康课程',
    href: '/vue-patient-app/dashboard/health-courses',
    icon: BookOpen,
  },
  {
    title: '社区互动',
    href: '/vue-patient-app/dashboard/community',
    icon: Users,
  },
   {
    title: '我的',
    href: '/vue-patient-app/dashboard/profile',
    icon: UserCircle,
  },
  { 
    title: '编辑资料', // Sub-page of profile
    href: '/vue-patient-app/dashboard/profile/edit-details',
    icon: UserCircle, // Often shares parent icon or use specific like 'Edit'
  },
  {
    title: '系统设置',
    href: '/vue-patient-app/dashboard/settings',
    icon: Settings,
  },
  {
    title: '帮助与支持',
    href: '/vue-patient-app/dashboard/help',
    icon: HelpCircle,
  },
];

// For bottom navigation bar
export const bottomNavLinksVue: NavItemVue[] = [
  { title: '仪表盘', href: '/vue-patient-app/dashboard', icon: LayoutDashboard },
  { title: '健康数据', href: '/vue-patient-app/dashboard/health-data', icon: LineChart },
  { title: 'AI助手', href: '/vue-patient-app/dashboard/assistant', icon: Bot },
  { title: '我的', href: '/vue-patient-app/dashboard/profile', icon: UserCircle },
];
