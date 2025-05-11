
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Network } from "lucide-react";

export default function ApiManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Network className="h-6 w-6 text-primary" />
            API管理
          </CardTitle>
          <CardDescription>
            管理系统对外提供的API接口及其访问权限和安全设置。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">API管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于管理和维护系统API接口，包括密钥生成和权限配置。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
