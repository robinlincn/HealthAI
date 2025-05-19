
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power, CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, MessageCircle, CreditCard, Mail, Loader2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ExternalService {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  lastCheck: string; // ISO date string
  icon: React.ElementType;
  description?: string;
}

const initialExternalServices: ExternalService[] = [
  { id: 'db_main', name: '主数据库服务', status: 'online', lastCheck: new Date().toISOString(), icon: Database, description: "核心业务数据库集群。" },
  { id: 'message_queue', name: '消息队列服务', status: 'online', lastCheck: new Date().toISOString(), icon: MessageCircle, description: "处理异步任务和消息传递。" },
  { id: 'payment_gateway', name: '支付网关接口', status: 'degraded', lastCheck: new Date().toISOString(), icon: CreditCard, description: "处理订单支付，当前响应较慢。" },
  { id: 'email_service', name: '邮件发送服务', status: 'online', lastCheck: new Date().toISOString(), icon: Mail, description: "负责发送系统通知和营销邮件。" },
  { id: 'yingdao_rpa', name: '影刀RPA集成', status: 'offline', lastCheck: new Date().toISOString(), icon: Power, description: "与影刀RPA平台的连接。" },
  { id: 'wechat_service', name: '微信公众号服务', status: 'unknown', lastCheck: new Date(Date.now() - 1000 * 60 * 30).toISOString(), icon: MessageCircle, description: "微信公众号消息与菜单服务。" },
];


export default function ExternalSystemStatusPage() {
  const [services, setServices] = useState<ExternalService[]>(initialExternalServices);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    // Simulate initial fetch or use potentially pre-loaded data
    // For demo, we set it directly. In a real app, this might be an API call.
  }, []);
  
  const fetchServiceStatus = (serviceId: string) => {
    setIsLoading(prev => ({ ...prev, [serviceId]: true }));
    const serviceName = services.find(s => s.id === serviceId)?.name || "服务";
    
    setTimeout(() => {
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                const statuses: ExternalService['status'][] = ['online', 'offline', 'degraded', 'unknown'];
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                return { ...s, status: newStatus, lastCheck: new Date().toISOString() };
            }
            return s;
        }));
        setIsLoading(prev => ({ ...prev, [serviceId]: false }));
        toast({ title: "状态已刷新", description: `服务 "${serviceName}" 状态已更新。`});
    }, 1500);
  };

  const getStatusBadge = (status: ExternalService['status']) => {
    switch(status) {
        case 'online': return <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle className="h-3.5 w-3.5 mr-1"/>在线</Badge>;
        case 'offline': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300"><XCircle className="h-3.5 w-3.5 mr-1"/>离线</Badge>;
        case 'degraded': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>性能下降</Badge>;
        case 'unknown': return <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>状态未知</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle className="text-xl">外部系统监控</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载监控数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Power className="h-6 w-6 text-primary" />
            外部系统状态监控
          </CardTitle>
          <CardDescription>
            实时监控依赖的外部系统（如数据库、消息队列、第三方API等）的运行状态。
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map(service => {
                    const ServiceIcon = service.icon;
                    return (
                        <Card key={service.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-medium flex items-center">
                                        <ServiceIcon className="h-5 w-5 mr-2 text-primary/80"/>
                                        {service.name}
                                    </CardTitle>
                                    {getStatusBadge(service.status)}
                                </div>
                                {service.description && <CardDescription className="text-xs mt-1">{service.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    上次检查: {format(new Date(service.lastCheck), "yyyy-MM-dd HH:mm:ss")}
                                </p>
                                <Button variant="outline" size="sm" onClick={() => fetchServiceStatus(service.id)} disabled={isLoading[service.id]} className="w-full text-xs h-8">
                                    {isLoading[service.id] ? <Loader2 className="mr-2 h-3 w-3 animate-spin"/> : <RefreshCw className="mr-2 h-3 w-3"/>} 
                                    {isLoading[service.id] ? '刷新中...' : '刷新状态'}
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            {services.length === 0 && (
                 <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
                    <Power className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-lg font-semibold text-muted-foreground">暂无配置外部系统监控</p>
                    <p className="text-sm text-muted-foreground mt-1">
                    请在系统设置中配置需要监控的外部服务。
                    </p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

