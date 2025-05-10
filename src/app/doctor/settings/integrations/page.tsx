
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlugZap, Hospital, FileText, Bot, Link2, ExternalLink } from "lucide-react"; // Hospital for EMR, FileText for lab
import { useToast } from "@/hooks/use-toast";

export default function DoctorSettingsIntegrationsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PlugZap className="mr-3 h-7 w-7 text-primary" />
            集成与扩展
          </CardTitle>
          <CardDescription>
            管理与外部系统（如电子病历系统、检查设备）的集成，以及API接口的配置。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Link2 className="mr-2 h-5 w-5 text-muted-foreground"/>与其他系统集成</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EMR Integration */}
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Hospital className="mr-3 h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold">电子病历系统 (EMR)</h4>
              </div>
              <Switch id="emrIntegration" disabled />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              与医院的电子病历系统集成，自动同步病人基本信息和主要诊断。
            </p>
            <Input placeholder="EMR系统API端点 (建设中)" className="mb-2" disabled />
            <Button variant="outline" disabled>配置EMR集成</Button>
          </div>

          {/* Lab/Device Integration */}
          <div className="p-4 border rounded-md">
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <FileText className="mr-3 h-6 w-6 text-green-600" />
                    <h4 className="text-lg font-semibold">检查设备/LIS系统</h4>
                </div>
                <Switch id="deviceIntegration" disabled />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              与血糖仪、血压计等智能设备或检验科LIS系统集成，自动接收和导入检查数据。
            </p>
            <Button variant="outline" disabled>管理设备连接</Button>
          </div>
          
          {/* Third-party Services */}
           <div className="p-4 border rounded-md">
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <Bot className="mr-3 h-6 w-6 text-purple-600" /> {/* Or ShoppingCart for pharmacy */}
                    <h4 className="text-lg font-semibold">第三方健康服务</h4>
                </div>
                 <Switch id="thirdPartyIntegration" disabled />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              集成在线药房、健康咨询平台等第三方服务 (功能规划中)。
            </p>
            <Button variant="outline" disabled>浏览可用服务</Button>
          </div>

        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><ExternalLink className="mr-2 h-5 w-5 text-muted-foreground"/>API接口管理</CardTitle>
          <CardDescription>提供API接口，方便其他系统调用和扩展功能 (开发者功能)。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <p className="text-sm"><strong>API 端点:</strong> <code>https://api.example.com/v1/doctor_portal</code> (示例)</p>
            <Button variant="secondary" disabled>生成API密钥</Button>
            <Button variant="link" disabled>查看API文档 <ExternalLink className="ml-1 h-3 w-3"/></Button>
            <p className="text-xs text-muted-foreground">API接口功能及文档正在建设中。此功能主要面向有开发能力的机构或用于系统间对接。</p>
        </CardContent>
      </Card>
    </div>
  );
}
