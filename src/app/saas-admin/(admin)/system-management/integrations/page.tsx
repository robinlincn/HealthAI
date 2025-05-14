
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlugZap, Bot, BarChart3, MessageCircle, Settings, CheckCircle, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

interface IntegrationService {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  isEnabled: boolean;
  configurable: boolean;
}

const initialIntegrations: IntegrationService[] = [
  { id: 'genkit_gemini', name: 'Google Genkit (Gemini AI)', description: '平台核心AI能力提供方，用于智能问答、报告生成等。', icon: Bot, iconColor: "text-purple-500", isEnabled: true, configurable: true },
  { id: 'wechat_messaging', name: '微信消息服务', description: '用于向用户和群组发送通知和提醒。', icon: MessageCircle, iconColor: "text-green-500", isEnabled: false, configurable: true },
  { id: 'external_bi', name: '外部BI数据分析', description: '连接到外部商业智能平台进行深度数据分析。', icon: BarChart3, iconColor: "text-blue-500", isEnabled: false, configurable: true },
  { id: 'sms_gateway', name: '短信网关服务', description: '用于发送重要通知和验证码。', icon: MessageCircle, iconColor: "text-teal-500", isEnabled: false, configurable: true },
];


export default function SaasIntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationService[]>(initialIntegrations);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleToggleIntegration = (serviceId: string) => {
    setIntegrations(prev => prev.map(s => s.id === serviceId ? {...s, isEnabled: !s.isEnabled } : s));
    const service = integrations.find(s => s.id === serviceId);
    if(service){
        toast({ title: "集成状态已更新", description: `服务 "${service.name}" 已${service.isEnabled ? '禁用' : '启用'}。` });
    }
  };

  const handleConfigureIntegration = (serviceName: string) => {
    toast({ title: "配置服务 (模拟)", description: `配置 "${serviceName}" 的功能正在开发中。` });
  };
  
  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>集成与扩展</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载集成数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PlugZap className="h-6 w-6 text-primary" />
            集成与扩展 (SAAS平台)
          </CardTitle>
          <CardDescription>
            管理SAAS平台与外部服务（如AI模型平台、分析工具、通讯服务）的集成和扩展插件。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {integrations.map(service => {
            const ServiceIcon = service.icon;
            return (
              <Card key={service.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ServiceIcon className={`mr-2 h-5 w-5 ${service.iconColor || 'text-muted-foreground'}`}/>
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-sm">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`switch-${service.id}`} 
                      checked={service.isEnabled} 
                      onCheckedChange={() => handleToggleIntegration(service.id)}
                    />
                    <Label htmlFor={`switch-${service.id}`} className="text-sm">
                      {service.isEnabled ? <span className="text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/>已启用</span> : <span className="text-gray-600 flex items-center"><XCircle className="h-4 w-4 mr-1"/>已禁用</span>}
                    </Label>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleConfigureIntegration(service.name)} 
                    disabled={!service.configurable}
                  >
                    <Settings className="mr-2 h-4 w-4"/> 配置参数
                  </Button>
                </CardContent>
              </Card>
            )
          })}
          
          <Card className="mt-6 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">插件与扩展市场 (规划中)</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">未来将支持通过插件市场发现和安装更多扩展功能，以增强平台能力。</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
