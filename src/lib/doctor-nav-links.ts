
import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  BarChart3,
  ClipboardList,
  MessagesSquare,
  Send,
  PhoneOutgoing,
  FilePieChart,
  TrendingUp,
  ShieldCheck,
  UserCog, 
  TableProperties,
  ShoppingBag, 
  PackageSearch, 
  DollarSign,  
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
    href: '/doctor/analytics', // Parent route for analytics
    icon: BarChart3,
    label: '分析与报告',
    children: [
      {
        title: '病人数据分析', // Specific page for selecting patient for analysis
        href: '/doctor/analytics', // Points to the main selection page
        icon: BarChart3, // Can reuse parent icon or use a more specific one like Users
      },
      // AI Report and other sub-items could be added here or accessed via patient detail
    ],
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
    title: '商品销售',
    href: '/doctor/product-sales', // Parent link points to the first child or a dedicated overview
    icon: ShoppingBag,
    label: '商城业务', 
    children: [
      {
        title: '商品列表与销售',
        href: '/doctor/product-sales', // This will be the page in the product-sales folder
        icon: PackageSearch,
      },
      {
        title: '销售结算',
        href: '/doctor/product-sales/settlement',
        icon: DollarSign,
      },
    ],
  },
  {
    title: '统计报告',
    href: '/doctor/statistics', // Parent route for statistics
    icon: FilePieChart,
    label: '数据中心', // Re-using '分析与报告' or new label if distinct
    children: [
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
            icon: TableProperties,
        },
    ]
  },
  {
    title: '医生资料',
    href: '/doctor/profile',
    icon: UserCircle,
    label: '个人设置'
  },
];
