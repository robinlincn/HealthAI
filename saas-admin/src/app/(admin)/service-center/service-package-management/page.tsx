
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Package } from "lucide-react";

export default function ServicePackageManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6 text-primary" />
            服务包管理
          </CardTitle>
          <CardDescription>
            创建、编辑和管理平台提供的各类服务包，并配置其权限。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">服务包管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于定义和管理平台的服务套餐，包括创建、编辑、定价和权限配置。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
