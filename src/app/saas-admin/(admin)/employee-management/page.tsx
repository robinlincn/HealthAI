
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
          <p className="text-muted-foreground">
            此功能用于管理各个企业/医院账户内部的员工用户：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>选择目标企业/医院账户。</li>
            <li>添加、编辑、删除员工账户。</li>
            <li>设置员工的基本信息（姓名、工号、联系方式、所属部门等）。</li>
            <li>为员工分配系统角色和具体的操作权限。</li>
            <li>管理员工的登录凭证（如重置密码、启用/禁用账户）。</li>
            <li>查看员工列表，支持按部门、角色等条件筛选和搜索。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">员工账户管理功能正在建设中。</p>
             <p className="text-xs text-muted-foreground mt-1">将包含员工列表表格、筛选器、添加/编辑员工表单等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```