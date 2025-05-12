'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlugZap, Bot, BarChart3, MessageCircle } from "lucide-react"; // Using Bot for AI, BarChart3 for Analytics
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SaasIntegrationsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PlugZap className="h-6 w-6 text-primary" />
            集成与扩展 (SAAS平台)
          </CardTitle>
          <CardDescription>
            管理SAAS平台与外部服务（如AI模型平台、分析工具）的集成和扩展插件。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Bot className="mr-2 h-5 w-5 text-purple-500"/>AI模型平台集成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="genkitIntegration" className="text-sm">Google Genkit (Gemini)</Label>
                <Switch id="genkitIntegration" checked disabled />
              </div>
              <p className="text-xs text-muted-foreground">当前平台默认使用Genkit与Google AI集成。未来可能支持更多AI服务商。</p>
              <Button variant="outline" disabled>配置AI服务参数</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-blue-500"/>数据分析与可视化工具</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="analyticsTool" className="text-sm">集成外部BI/分析平台</Label>
                <Switch id="analyticsTool" disabled />
              </div>
              <p className="text-xs text-muted-foreground">支持将平台数据导出或连接到主流BI工具进行深度分析 (功能规划中)。</p>
              <Button variant="outline" disabled>配置数据导出</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><MessageCircle className="mr-2 h-5 w-5 text-green-500"/>通讯服务集成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="smsGateway" className="text-sm">短信网关</Label>
                <Switch id="smsGateway" disabled />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="wechatOfficial" className="text-sm">微信公众号/企业微信</Label>
                <Switch id="wechatOfficial" disabled />
              </div>
              <p className="text-xs text-muted-foreground">用于消息推送、验证码等服务 (相关配置功能正在建设中)。</p>
              <Button variant="outline" disabled>管理通讯服务配置</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">插件与扩展市场 (规划中)</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">未来将支持通过插件市场扩展平台功能。</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
