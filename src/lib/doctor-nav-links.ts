import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  // Settings, // Removed as main settings group is gone
  BarChart3,
  ClipboardList,
  MessagesSquare,
  Send, 
  TrendingUp, 
  ShieldCheck, 
  FilePieChart, 
  // UserCog, // Moved to SAAS
  // DatabaseBackup, // Moved to SAAS
  // Settings2, // Moved to SAAS
  // PlugZap, // Moved to SAAS
  TableProperties,
  PhoneOutgoing,
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
    title: '外呼计划', 
    href: '/doctor/outbound-plans',
    icon: PhoneOutgoing, 
  },
  {
    title: '统计报告',
    href: '/doctor/statistics', 
    icon: FilePieChart,
    label: '数据中心', 
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
  // System Management section and its children are removed from here
  {
    title: '医生资料',
    href: '/doctor/profile',
    icon: UserCircle,
    label: '个人设置' // Adding a label for clarity
  },
];

