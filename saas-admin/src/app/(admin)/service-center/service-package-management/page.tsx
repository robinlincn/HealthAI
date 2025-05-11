import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Package, Edit, Trash2, PlusCircle } from "lucide-react";

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
          <p className="text-muted-foreground">
            此模块用于定义和管理平台可以向企业/医院提供的服务套餐：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>创建新的服务包：设置名称、类型（如基础版、专业版、慢病管理包）、价格、服务周期、包含的服务内容和亮点。</li>
            <li>编辑现有服务包信息。</li>
            <li>删除不再提供的服务包。</li>
            <li>关联服务包与企业/医院账户，或特定部门、员工，实现服务包的销售和权限管理。</li>
            <li>确定哪些员工或部门有权限提供或销售特定的服务包。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <PlusCircle className="h-8 w-8" />
                <Edit className="h-8 w-8" />
                <Trash2 className="h-8 w-8" />
            </div>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">服务包创建、编辑和权限管理功能正在建设中。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
