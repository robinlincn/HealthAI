
import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  Settings,
  BarChart3,
  ClipboardList,
  MessagesSquare,
  Send, 
  TrendingUp, 
  ShieldCheck, 
  FilePieChart, 
  UserCog, 
  DatabaseBackup,
  Settings2, 
  PlugZap,
  TableProperties,
  PhoneOutgoing, // Added for Outbound Call Plan
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
    href: '/doctor/treatment-plans', 
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
    title: '外呼计划', // New Outbound Call Plan page
    href: '/doctor/outbound-plans',
    icon: PhoneOutgoing, 
  },
  {
    title: '统计报告',
    href: '/doctor/statistics', 
    icon: FilePieChart,
    label: '数据中心', // Grouping related items
  },
  {
    title: '病情趋势分析',
    href: '/doctor/statistics/trends',
    icon: TrendingUp,
    label: '数据中心', 
  },
  {
    title: '治疗效果评估',
    href: '/doctor/statistics/evaluation',
    icon: ShieldCheck,
    label: '数据中心',
  },
  {
    title: '自定义报表',
    href: '/doctor/statistics/custom-reports',
    icon: TableProperties, 
    label: '数据中心',
  },
  {
    title: '系统管理',
    href: '/doctor/settings', 
    icon: Settings,
    label: '配置', // Grouping settings
  },
  {
    title: '用户与权限',
    href: '/doctor/settings/users',
    icon: UserCog, 
    label: '配置', 
  },
  {
    title: '数据备份与恢复',
    href: '/doctor/settings/backup',
    icon: DatabaseBackup,
    label: '配置',
  },
  {
    title: '系统配置',
    href: '/doctor/settings/system',
    icon: Settings2,
    label: '配置',
  },
  {
    title: '外部系统集成',
    href: '/doctor/settings/integrations',
    icon: PlugZap,
    label: '配置',
  },
  {
    title: '医生资料',
    href: '/doctor/profile',
    icon: UserCircle,
  },
];

