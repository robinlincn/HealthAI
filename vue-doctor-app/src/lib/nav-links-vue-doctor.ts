import type { NavItemVue } from './types-vue'; // Assuming types-vue.ts will be created or shared
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
  // Add more icons as needed
} from 'lucide-vue-next';

export const doctorNavLinksVue: NavItemVue[] = [
  {
    title: '仪表盘',
    href: '/vue-doctor-app/dashboard', // Ensure base path is included
    icon: LayoutDashboard,
  },
  {
    title: '预约安排',
    href: '/vue-doctor-app/dashboard/appointments', // Placeholder
    icon: CalendarDays,
  },
  {
    title: '病人管理',
    href: '/vue-doctor-app/dashboard/patients', // Placeholder
    icon: Users,
  },
  {
    title: '病情分析',
    href: '/vue-doctor-app/dashboard/analytics',  // Placeholder
    icon: BarChart3,
  },
  {
    title: '治疗方案',
    href: '/vue-doctor-app/dashboard/treatment-plans', // Placeholder
    icon: ClipboardList,
  },
  {
    title: '病人咨询',
    href: '/vue-doctor-app/dashboard/consultations', // Placeholder
    icon: MessagesSquare,
  },
  {
    title: '消息推送',
    href: '/vue-doctor-app/dashboard/messages', // Placeholder
    icon: Send,
  },
  {
    title: '外呼计划',
    href: '/vue-doctor-app/dashboard/outbound-plans', // Placeholder
    icon: PhoneOutgoing,
  },
  {
    title: '统计报告',
    href: '/vue-doctor-app/dashboard/statistics', // Placeholder
    icon: FilePieChart,
    label: '数据中心',
  },
  {
    title: '医生资料',
    href: '/vue-doctor-app/dashboard/profile', // Placeholder
    icon: UserCircle,
    label: '个人设置'
  },
];
