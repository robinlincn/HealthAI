import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Shield, KeyRound, ListChecks } from "lucide-react";

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
          <p className="text-muted-foreground">
            此模块用于精细化管理系统内的角色和权限：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>创建和管理角色：定义不同类型的用户角色（如SAAS平台管理员、企业账户管理员、企业员工/医生、普通客户/病人）。</li>
            <li>权限定义：列出系统中所有可控制的操作权限点（如查看病人列表、编辑病历、发起外呼、管理服务包等）。</li>
            <li>为每个角色分配具体的操作权限。</li>
            <li>支持权限继承或基于属性的访问控制（ABAC）等高级模式（规划中）。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <KeyRound className="h-8 w-8" />
                <ListChecks className="h-8 w-8" />
            </div>
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">角色定义和权限分配功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含角色列表、权限树/列表、角色-权限关联界面等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
