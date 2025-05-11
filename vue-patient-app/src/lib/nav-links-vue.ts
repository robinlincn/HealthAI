import type { NavItemVue } from '@/lib/types-vue';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  HeartPulse, 
  Apple,
  ClipboardList,
  MessageSquare, // Using MessageSquare as Bot is not directly available in lucide-vue-next in the same way
  Settings,
  LineChart, 
  BookOpen, 
  Users, 
  HelpCircle, 
  BellRing, 
} from 'lucide-vue-next';

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
    icon: MessageSquare, // Changed from MessageSquare (React specific)
  },
  {
    title: 'AI小助手',
    href: '/dashboard/assistant',
    icon: MessageSquare, // Changed icon to MessageSquare as a placeholder for Bot
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
