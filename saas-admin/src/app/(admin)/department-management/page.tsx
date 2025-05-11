import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Building2 } from "lucide-react";

export default function DepartmentManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6 text-primary" />
            部门管理 (医院科室管理)
          </CardTitle>
          <CardDescription>
            针对每个企业/医院账户，管理其内部的部门或科室结构。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此功能允许管理员为选定的企业或医院账户设置和管理其组织结构：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>创建、编辑、删除部门或科室。</li>
            <li>建立部门层级关系（如父部门、子部门）。</li>
            <li>为部门分配负责人或管理员。</li>
            <li>查看各企业/医院的部门/科室列表。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">部门/科室管理功能正在建设中。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
