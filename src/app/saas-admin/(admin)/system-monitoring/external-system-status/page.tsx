
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Power, Wifi, AlertTriangle } from "lucide-react";

export default function ExternalSystemStatusPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Power className="h-6 w-6 text-primary" />
            外部系统状态监控
          </CardTitle>
          <CardDescription>
            监控依赖的外部系统（如影刀、微信服务、支付网关等）是否正常启动和运行。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此模块用于监控与本SAAS平台集成的关键外部服务的状态：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>配置需要监控的外部服务及其健康检查端点或方式。</li>
            <li>实时显示各外部服务的运行状态（如：正常、异常、警告）。</li>
            <li>记录外部服务的连接历史和中断事件。</li>
            <li>当外部服务出现故障时，发送告警通知给平台管理员。</li>
            <li>例如：监控影刀RPA流程执行状态、微信公众号/小程序API接口连通性、短信/邮件网关状态、支付接口状态等。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <Wifi className="h-8 w-8 text-green-500" />
                <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <Power className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">外部系统状态监控配置和展示功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含服务状态列表、健康检查配置、告警历史等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
