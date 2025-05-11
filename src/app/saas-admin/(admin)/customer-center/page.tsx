
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartHandshake, Users } from "lucide-react"; // Changed icon to Users for better representation

export default function CustomerCenterPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            客户中心 (医院病人管理)
          </CardTitle>
          <CardDescription>
            查看和管理由各企业/医院服务的最终客户（病人）信息汇总。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">客户病人信息汇总功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将允许平台管理员查看所有企业/医院的病人数据概览，进行统计分析，并按需管理（如数据迁移、问题排查等，具体权限待定）。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
