
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power, CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, MessageCircle, CreditCard, Mail } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ExternalService {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  lastCheck: string; // ISO date string
  icon: React.ElementType;
}

const mockExternalServices: ExternalService[] = [
  { id: 'db_main', name: '主数据库', status: 'online', lastCheck: new Date().toISOString(), icon: Database },
  { id: 'message_queue', name: '消息队列服务', status: 'online', lastCheck: new Date().toISOString(), icon: MessageCircle },
  { id: 'payment_gateway', name: '支付网关', status: 'degraded', lastCheck: new Date().toISOString(), icon: CreditCard },
  { id: 'email_service', name: '邮件服务', status: 'online', lastCheck: new Date().toISOString(), icon: Mail },
  { id: 'yingdao_rpa', name: '影刀RPA集成', status: 'offline', lastCheck: new Date().toISOString(), icon: Power }, // Using Power as a generic RPA icon
  { id: 'wechat_service', name: '微信公众号服务', status: 'unknown', lastCheck: new Date(Date.now() - 1000 * 60 * 30).toISOString(), icon: MessageCircle }, // Unknown if not checked recently
];


export default function ExternalSystemStatusPage() {
  const [services, setServices] = useState<ExternalService[]>([]);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({}); // Track loading state per service
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setServices(mockExternalServices);
  }, []);
  
  const fetchServiceStatus = (serviceId: string) => {
    setIsLoading(prev => ({ ...prev, [serviceId]: true }));
    // Simulate API call
    setTimeout(() => {
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                // Randomly change status for demo
                const statuses: ExternalService['status'][] = ['online', 'offline', 'degraded'];
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                return { ...s, status: newStatus, lastCheck: new Date().toISOString() };
            }
            return s;
        }));
        setIsLoading(prev => ({ ...prev, [serviceId]: false }));
        toast({ title: "状态已刷新", description: `服务 ${services.find(s=>s.id===serviceId)?.name} 状态已更新。`});
    }, 1000);
  };

  const getStatusBadge = (status: ExternalService['status']) => {
    switch(status) {
        case 'online': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3.5 w-3.5 mr-1"/>在线</Badge>;
        case 'offline': return <Badge variant="destructive"><XCircle className="h-3.5 w-3.5 mr-1"/>离线</Badge>;
        case 'degraded': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>性能下降</Badge>;
        case 'unknown': return <Badge variant="secondary"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>未知</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>外部系统监控</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载监控数据...</p></CardContent></Card>
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
                        <Card key={service.id} className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium flex items-center">
                                    <ServiceIcon className="h-5 w-5 mr-2 text-primary/80"/>
                                    {service.name}
                                </CardTitle>
                                {getStatusBadge(service.status)}
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    上次检查: {new Date(service.lastCheck).toLocaleString()}
                                </p>
                            </CardContent>
                            <CardContent className="pt-0">
                                <Button variant="outline" size="sm" onClick={() => fetchServiceStatus(service.id)} disabled={isLoading[service.id]} className="w-full text-xs">
                                    <RefreshCw className={`mr-2 h-3 w-3 ${isLoading[service.id] ? 'animate-spin' : ''}`}/> 刷新状态
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
