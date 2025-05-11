import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Building2,
  Users,
  HeartHandshake,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  Send,
  SlidersHorizontal,
  KeyRound,
  Cog,
  MonitorPlay,
  UsersRound,
  Clock,
  Power,
  LayoutDashboard,
  Shield,
  FileText,
  Network
} from 'lucide-react';

export interface SaasNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string; // For grouping in the sidebar
  children?: SaasNavItem[];
}

export const saasNavLinks: SaasNavItem[] = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '企业管理',
    href: '/admin/enterprise-management',
    icon: Briefcase,
    label: '客户与服务',
  },
  {
    title: '部门管理',
    href: '/admin/department-management',
    icon: Building2,
    label: '客户与服务',
  },
  {
    title: '员工管理',
    href: '/admin/employee-management',
    icon: Users,
    label: '客户与服务',
  },
  {
    title: '客户中心',
    href: '/admin/customer-center',
    icon: HeartHandshake,
    label: '客户与服务',
  },
  {
    title: '服务中心',
    href: '/admin/service-center', // Parent route
    icon: Package,
    label: '运营管理',
    children: [
      {
        title: '服务包管理',
        href: '/admin/service-center/service-package-management',
        icon: Package, // Can use a more specific icon if available or same
      },
      {
        title: '订单管理',
        href: '/admin/service-center/order-management',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: '社群管理',
    href: '/admin/community-management',
    icon: MessageSquare,
    label: '运营管理',
  },
  {
    title: 'SOP服务管理',
    href: '/admin/sop-service-management',
    icon: SlidersHorizontal, // Using SlidersHorizontal for workflow/SOP
    label: '运营管理',
  },
  {
    title: '外呼任务',
    href: '/admin/outbound-call-tasks',
    icon: Send,
    label: '运营管理',
  },
  {
    title: '系统管理',
    href: '/admin/system-management', // Parent route
    icon: Settings,
    label: '系统配置',
    children: [
      {
        title: 'API管理',
        href: '/admin/system-management/api-management',
        icon: Network, // Changed from FileText for better semantics
      },
      {
        title: '用户管理', // SAAS Platform Admins
        href: '/admin/system-management/user-management',
        icon: UsersRound, // Specific icon for admin users
      },
      {
        title: '权限管理',
        href: '/admin/system-management/permission-management',
        icon: Shield,
      },
      {
        title: '系统设置',
        href: '/admin/system-management/system-settings',
        icon: Cog,
      },
    ],
  },
  {
    title: '系统监控',
    href: '/admin/system-monitoring', // Parent route
    icon: MonitorPlay,
    label: '系统配置',
    children: [
       {
        title: '外部系统状态',
        href: '/admin/system-monitoring/external-system-status',
        icon: Power, 
      },
      {
        title: '在线用户',
        href: '/admin/system-monitoring/online-users',
        icon: Users, // Generic users icon for online users
      },
      {
        title: '定时任务',
        href: '/admin/system-monitoring/scheduled-tasks',
        icon: Clock,
      },
    ],
  },
];
