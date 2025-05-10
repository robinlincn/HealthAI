
import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  Settings,
  BarChart3,
  FileSpreadsheet,
  ClipboardList,
  MessagesSquare,
  Send, // Changed from Mail for Push, Megaphone could also work
  TrendingUp,
  ShieldCheck,
  FilePieChart,
  UsersCog,
  DatabaseBackup,
  Settings2,
  PlugZap,
} from 'lucide-react';

export const doctorNavLinks: NavItem[] = [
  {
    title: '仪表盘',
    href: '/doctor',
    icon: LayoutDashboard,
  },
  {
    title: '预约安排',
    href: '/doctor/appointments',
    icon: CalendarDays,
  },
  {
    title: '病人管理',
    href: '/doctor/patients',
    icon: Users,
  },
  {
    title: '病情分析',
    href: '/doctor/analytics', // Main group, can be a non-clickable group header or link to overview
    icon: BarChart3, // Placeholder, can be changed if we make this a group
    // For now, let's assume direct links or a future sub-menu capability
    // If we want sub-menus, the structure of NavItem and SidebarNav needs to support it.
    // For simplicity now, flat list.
  },
  {
    title: '健康数据可视化',
    href: '/doctor/analytics/visualization',
    icon: BarChart3, // Or LineChart
  },
  {
    title: '数据分析报告 (AI)',
    href: '/doctor/analytics/reports',
    icon: FileSpreadsheet,
  },
  {
    title: '治疗方案与建议',
    href: '/doctor/treatment-plans',
    icon: ClipboardList, // Consistent with user side
  },
  {
    title: '病人咨询',
    href: '/doctor/consultations',
    icon: MessagesSquare,
  },
  {
    title: '消息推送',
    href: '/doctor/messages', // Existing page, will be refined
    icon: Send,
  },
  {
    title: '统计报告',
    href: '/doctor/statistics', // Main group for statistics
    icon: FilePieChart,
  },
  {
    title: '病情趋势分析',
    href: '/doctor/statistics/trends',
    icon: TrendingUp,
  },
  {
    title: '治疗效果评估',
    href: '/doctor/statistics/evaluation',
    icon: ShieldCheck,
  },
  {
    title: '自定义报表',
    href: '/doctor/statistics/custom-reports',
    icon: FilePieChart, // Or `TableProperties`
  },
  {
    title: '系统管理',
    href: '/doctor/settings', // Main group for settings
    icon: Settings,
  },
  {
    title: '用户与权限',
    href: '/doctor/settings/users',
    icon: UsersCog,
  },
  {
    title: '数据备份与恢复',
    href: '/doctor/settings/backup',
    icon: DatabaseBackup,
  },
  {
    title: '系统配置',
    href: '/doctor/settings/system',
    icon: Settings2,
  },
  {
    title: '外部系统集成',
    href: '/doctor/settings/integrations',
    icon: PlugZap,
  },
  {
    title: '医生资料',
    href: '/doctor/profile',
    icon: UserCircle,
  },
];
