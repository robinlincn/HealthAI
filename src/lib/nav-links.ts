import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  HeartPulse,
  Apple,
  ClipboardList,
  MessageSquare,
  Bot,
  Settings,
  LineChart
} from 'lucide-react';

export const navLinks: NavItem[] = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '个人信息',
    href: '/dashboard/profile',
    icon: UserCircle,
  },
  {
    title: '健康报告',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    title: '营养管理',
    href: '/dashboard/nutrition',
    icon: Apple,
  },
  {
    title: '健康可视化',
    href: '/dashboard/visualizations',
    icon: LineChart,
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
    icon: Bot,
  },
  {
    title: '消息通知',
    href: '/dashboard/messages',
    icon: HeartPulse, // Using HeartPulse as a placeholder for notifications related to health
  },
  // {
  //   title: '系统设置',
  //   href: '/dashboard/settings',
  //   icon: Settings,
  //   disabled: true, // Example for a future feature
  // },
];
