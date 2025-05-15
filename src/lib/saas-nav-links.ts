
import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Building2,
  Users, 
  Package,
  ShoppingCart, 
  MessageSquare,
  Settings,
  Send,
  SlidersHorizontal,
  Cog, 
  MonitorPlay,
  UsersRound,
  Clock,
  Power,
  LayoutDashboard,
  Shield,
  Network,
  DatabaseBackup, 
  PlugZap,      
  Settings2,
  BrainCog, // Added icon for LLM Settings
} from 'lucide-react';

export interface SaasNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string; 
  children?: SaasNavItem[];
}

const baseSaasPath = '/saas-admin'; 

export const saasNavLinks: SaasNavItem[] = [
  {
    title: '仪表盘',
    href: `${baseSaasPath}`, 
    icon: LayoutDashboard,
  },
  {
    title: '企业管理',
    href: `${baseSaasPath}/enterprise-management`,
    icon: Briefcase,
    label: '客户与服务',
  },
  {
    title: '部门管理',
    href: `${baseSaasPath}/department-management`,
    icon: Building2,
    label: '客户与服务',
  },
  {
    title: '员工管理',
    href: `${baseSaasPath}/employee-management`,
    icon: UsersRound, 
    label: '客户与服务',
  },
  {
    title: '客户中心', 
    href: `${baseSaasPath}/customer-center`,
    icon: Users, 
    label: '客户与服务',
  },
  {
    title: '服务中心',
    href: `${baseSaasPath}/service-center`, 
    icon: Package,
    label: '运营管理',
    children: [
      {
        title: '服务包管理',
        href: `${baseSaasPath}/service-center/service-package-management`,
        icon: Package, 
      },
      {
        title: '订单管理',
        href: `${baseSaasPath}/service-center/order-management`,
        icon: ShoppingCart, 
      },
    ],
  },
  {
    title: '社群管理',
    href: `${baseSaasPath}/community-management`,
    icon: MessageSquare, 
    label: '运营管理',
  },
  {
    title: 'SOP服务管理',
    href: `${baseSaasPath}/sop-service-management`,
    icon: SlidersHorizontal, 
    label: '运营管理',
  },
  {
    title: '外呼任务',
    href: `${baseSaasPath}/outbound-call-tasks`,
    icon: Send, 
    label: '运营管理',
  },
  {
    title: '系统管理',
    href: `${baseSaasPath}/system-management`, 
    icon: Settings, // Main group icon
    label: '系统配置',
    children: [
      {
        title: 'SAAS平台用户',
        href: `${baseSaasPath}/system-management/user-management`,
        icon: UsersRound, 
      },
      {
        title: '角色与权限',
        href: `${baseSaasPath}/system-management/permission-management`,
        icon: Shield,
      },
      {
        title: 'API接口管理',
        href: `${baseSaasPath}/system-management/api-management`,
        icon: Network, 
      },
      {
        title: 'AI模型设置', // New LLM Settings link
        href: `${baseSaasPath}/system-management/llm-settings`,
        icon: BrainCog,
      },
      {
        title: '数据备份与恢复',
        href: `${baseSaasPath}/system-management/backup`,
        icon: DatabaseBackup,
      },
      {
        title: '外部服务集成',
        href: `${baseSaasPath}/system-management/integrations`,
        icon: PlugZap,
      },
      {
        title: '平台参数设置',
        href: `${baseSaasPath}/system-management/system-settings`,
        icon: Settings2, 
      },
    ],
  },
  {
    title: '系统监控',
    href: `${baseSaasPath}/system-monitoring`, 
    icon: MonitorPlay, 
    label: '系统运维', 
    children: [
       {
        title: '外部系统状态',
        href: `${baseSaasPath}/system-monitoring/external-system-status`,
        icon: Power, 
      },
      {
        title: '在线用户列表',
        href: `${baseSaasPath}/system-monitoring/online-users`,
        icon: Users, 
      },
      {
        title: '后台定时任务',
        href: `${baseSaasPath}/system-monitoring/scheduled-tasks`,
        icon: Clock,
      },
    ],
  },
];

