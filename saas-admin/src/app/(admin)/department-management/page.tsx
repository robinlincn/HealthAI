
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
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">部门管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此功能将允许您为选定的企业/医院账户创建、编辑和组织其部门或科室层级。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
