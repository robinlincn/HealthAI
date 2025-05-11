import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { UsersRound, UserPlus, Edit, Trash2 } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UsersRound className="h-6 w-6 text-primary" />
            用户管理 (SAAS平台管理员)
          </CardTitle>
          <CardDescription>
            管理SAAS平台自身的管理员用户账户。企业/医院内部员工管理请前往“员工管理”模块。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此功能用于管理SAAS平台的系统管理员账号：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>创建、编辑、删除SAAS平台管理员账户。</li>
            <li>为平台管理员分配超级管理员或特定管理模块的权限。</li>
            <li>管理平台管理员的登录凭证和安全设置（如两步验证）。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <UserPlus className="h-8 w-8" />
                <Edit className="h-8 w-8" />
                <Trash2 className="h-8 w-8" />
            </div>
            <UsersRound className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">SAAS平台管理员账户管理功能正在建设中。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
