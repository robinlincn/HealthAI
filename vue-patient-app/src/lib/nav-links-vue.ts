import type { NavItemVue } from '@/lib/types-vue';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  // HeartPulse, // Not used in bottom bar, can be added if needed elsewhere
  Apple,
  ClipboardList,
  MessageSquare, 
  Settings,
  LineChart, 
  BookOpen, 
  Users, 
  HelpCircle, 
  BellRing, 
} from 'lucide-vue-next';

// These are for the main navigation structure if a sidebar or full list were used.
// The BottomNavigationBar uses a subset of these or its own list.
export const navLinks: NavItemVue[] = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '健康数据',
    href: '/dashboard/health-data',
    icon: LineChart,
  },
  {
    title: '饮食记录',
    href: '/dashboard/nutrition',
    icon: Apple,
  },
  {
    title: '检查报告', 
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    title: '治疗方案', 
    href: '/dashboard/treatment',
    icon: ClipboardList,
  },
  {
    title: '医生咨询',
    href: '/dashboard/consultations',
    icon: MessageSquare,
  },
  {
    title: 'AI小助手',
    href: '/dashboard/assistant',
    icon: MessageSquare, // Using MessageSquare as a placeholder for Bot
  },
  {
    title: '健康提醒', 
    href: '/dashboard/reminders',
    icon: BellRing, 
  },
  {
    title: '健康课程',
    href: '/dashboard/health-courses',
    icon: BookOpen,
  },
  {
    title: '社区互动',
    href: '/dashboard/community',
    icon: Users,
  },
   {
    title: '我的',
    href: '/dashboard/profile',
    icon: UserCircle,
  },
   {
    title: '编辑资料', // Often a sub-route of Profile
    href: '/dashboard/profile/edit-details',
    icon: UserCircle, // Or a more specific edit icon
  },
  {
    title: '系统设置',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: '帮助与支持',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
];
