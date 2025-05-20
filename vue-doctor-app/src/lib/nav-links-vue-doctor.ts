import type { NavItemVue } from './types-vue';
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
  TableProperties, // Using this for Custom Reports
} from 'lucide-vue-next';

export const doctorNavLinksVue: NavItemVue[] = [
  {
    title: '仪表盘',
    href: '/vue-doctor-app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '预约安排',
    href: '/vue-doctor-app/dashboard/appointments',
    icon: CalendarDays,
  },
  {
    title: '病人管理',
    href: '/vue-doctor-app/dashboard/patients',
    icon: Users,
  },
  {
    title: '病情分析',
    href: '/vue-doctor-app/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: '治疗方案',
    href: '/vue-doctor-app/dashboard/treatment-plans',
    icon: ClipboardList,
  },
  {
    title: '病人咨询',
    href: '/vue-doctor-app/dashboard/consultations',
    icon: MessagesSquare,
  },
  {
    title: '消息推送',
    href: '/vue-doctor-app/dashboard/messages',
    icon: Send,
  },
  {
    title: '外呼计划',
    href: '/vue-doctor-app/dashboard/outbound-plans',
    icon: PhoneOutgoing,
  },
  {
    title: '统计报告',
    href: '/vue-doctor-app/dashboard/statistics',
    icon: FilePieChart,
    label: '数据中心',
  },
  // Sub-items for 统计报告 (Data Center)
  {
    title: '病情趋势分析',
    href: '/vue-doctor-app/dashboard/statistics/trends', // Updated path
    icon: TrendingUp,
    label: '数据中心', 
  },
  {
    title: '治疗效果评估',
    href: '/vue-doctor-app/dashboard/statistics/evaluation', // Updated path
    icon: ShieldCheck,
    label: '数据中心',
  },
  {
    title: '自定义报表',
    href: '/vue-doctor-app/dashboard/statistics/custom-reports', // Updated path
    icon: TableProperties,
    label: '数据中心',
  },
  {
    title: '医生资料',
    href: '/vue-doctor-app/dashboard/profile',
    icon: UserCircle,
    label: '个人设置'
  },
];
