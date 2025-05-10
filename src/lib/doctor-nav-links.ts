
import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  Settings,
  BarChart3,
  FileSpreadsheet, // Kept for AI Report in Analytics detail, not primary nav.
  ClipboardList,
  MessagesSquare,
  Send, 
  TrendingUp, // For statistics/trends
  ShieldCheck, // For statistics/evaluation
  FilePieChart, // For statistics main & custom reports
  UserCog, 
  DatabaseBackup,
  Settings2, // Renamed from Cog for System Config
  PlugZap, // For integrations
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
    href: '/doctor/analytics', 
    icon: BarChart3,
  },
  {
    title: '治疗方案与建议',
    href: '/doctor/treatment-plans', // This now points to the list page
    icon: ClipboardList, 
  },
  {
    title: '病人咨询',
    href: '/doctor/consultations',
    icon: MessagesSquare,
  },
  {
    title: '消息推送',
    href: '/doctor/messages', 
    icon: Send,
  },
  {
    title: '统计报告',
    href: '/doctor/statistics', 
    icon: FilePieChart,
    // Sub-items for statistics are general statistical views, kept if they link to actual pages
  },
  {
    title: '病情趋势分析',
    href: '/doctor/statistics/trends',
    icon: TrendingUp,
    label: '统计报告', // Optional label for grouping under "统计报告"
  },
  {
    title: '治疗效果评估',
    href: '/doctor/statistics/evaluation',
    icon: ShieldCheck,
    label: '统计报告',
  },
  {
    title: '自定义报表',
    href: '/doctor/statistics/custom-reports',
    icon: TableProperties, // Using a different icon for custom reports as FilePieChart is for main
    label: '统计报告',
  },
  {
    title: '系统管理',
    href: '/doctor/settings', 
    icon: Settings,
     // Sub-items for settings, kept if they link to actual pages
  },
  {
    title: '用户与权限',
    href: '/doctor/settings/users',
    icon: UserCog, 
    label: '系统管理', // Optional label for grouping under "系统管理"
  },
  {
    title: '数据备份与恢复',
    href: '/doctor/settings/backup',
    icon: DatabaseBackup,
    label: '系统管理',
  },
  {
    title: '系统配置',
    href: '/doctor/settings/system',
    icon: Settings2,
    label: '系统管理',
  },
  {
    title: '外部系统集成',
    href: '/doctor/settings/integrations',
    icon: PlugZap,
    label: '系统管理',
  },
  {
    title: '医生资料',
    href: '/doctor/profile',
    icon: UserCircle,
  },
];
