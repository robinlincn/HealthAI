
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function EmployeeManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            员工管理 (医院医生/员工管理)
          </CardTitle>
          <CardDescription>
            管理企业/医院账户下的员工（如医生、护士、客服等）信息和系统访问权限。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">员工管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于管理企业/医院账户内部的员工用户，包括账户创建、角色分配等。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
