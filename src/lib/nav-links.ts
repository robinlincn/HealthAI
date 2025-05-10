import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  HeartPulse, // Maintained for '健康提醒' as it was previously for '消息通知'
  Apple,
  ClipboardList,
  MessageSquare,
  Bot,
  Settings,
  LineChart, // Maintained for '健康数据' as it was previously for '健康可视化'
  BookOpen, // For Health Courses
  Users, // For Community
  HelpCircle, // For Help & Support
  BellRing, // More direct icon for Reminders
} from 'lucide-react';

export const navLinks: NavItem[] = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '个人信息', // 病历记录的一部分
    href: '/dashboard/profile',
    icon: UserCircle,
  },
  {
    title: '健康数据', // 原 健康可视化
    href: '/dashboard/health-data',
    icon: LineChart,
  },
  {
    title: '饮食记录',
    href: '/dashboard/nutrition',
    icon: Apple,
  },
  {
    title: '检查报告', // 病历记录的一部分
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    title: '治疗方案', // 查看医生制定的方案
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
    title: '健康提醒', // 原 消息通知
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
