
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PermissionManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            权限管理 (角色与权限)
          </CardTitle>
          <CardDescription>
            定义系统中的角色（如企业管理员、医生、护士、病人）及其对应的操作权限。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">权限管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于精细化管理系统内的角色和权限分配。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
