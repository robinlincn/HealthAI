
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Power } from "lucide-react";

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
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Power className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">外部系统监控功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于监控与本SAAS平台集成的关键外部服务的状态。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
