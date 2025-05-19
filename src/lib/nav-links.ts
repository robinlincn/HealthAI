
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
  LineChart, 
  BookOpen, 
  Users, 
  HelpCircle, 
  BellRing, 
  Pill, // Added Pill icon
} from 'lucide-react';

export const navLinks: NavItem[] = [
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
    title: '用药计划', // New Medication Plan link
    href: '/dashboard/medication-plan',
    icon: Pill,
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
    icon: Bot,
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
