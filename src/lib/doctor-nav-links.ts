
import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Mail,
  UserCircle,
  Settings,
} from 'lucide-react';

export const doctorNavLinks: NavItem[] = [
  {
    title: '仪表盘',
    href: '/doctor',
    icon: LayoutDashboard,
  },
  {
    title: '患者管理',
    href: '/doctor/patients',
    icon: Users,
  },
  {
    title: '预约安排',
    href: '/doctor/appointments',
    icon: CalendarDays,
  },
  {
    title: '消息通知',
    href: '/doctor/messages',
    icon: Mail,
  },
  {
    title: '医生资料',
    href: '/doctor/profile',
    icon: UserCircle,
  },
  // {
  //   title: '系统设置',
  //   href: '/doctor/settings',
  //   icon: Settings,
  //   disabled: true,
  // },
];
