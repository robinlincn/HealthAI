
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
  UserCog, // Changed from UsersCog as per previous fix
  TableProperties,
  ShoppingBag, // New icon for Product Sales parent
  PackageSearch, // New icon for Product Sales child
  DollarSign,  // New icon for Sales Settlement child
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
    title: '商品销售',
    href: '/doctor/product-sales', // Parent link, can point to the first child
    icon: ShoppingBag,
    label: '商城业务', // New label group
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
    href: '/doctor/statistics',
    icon: FilePieChart,
    label: '数据中心',
    children: [ // Making statistics a parent if it has children
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
