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
  Bot, // Use Bot icon for AI Assistant
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
    icon: Bot, // Changed to Bot icon
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
  { // This is a sub-page, usually navigated to from '我的'
    title: '编辑资料',
    href: '/vue-patient-app/dashboard/profile/edit-details',
    icon: UserCircle, // Or specific edit icon
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
  { title: 'AI助手', href: '/vue-patient-app/dashboard/assistant', icon: Bot }, // Changed to Bot icon
  { title: '我的', href: '/vue-patient-app/dashboard/profile', icon: UserCircle },
];
