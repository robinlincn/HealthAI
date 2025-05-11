
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UsersRound } from "lucide-react"; 

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
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <UsersRound className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">SAAS用户管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此功能将用于管理SAAS平台的系统管理员账号。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
