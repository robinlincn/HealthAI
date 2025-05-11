
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

export default function CustomerCenterPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <HeartHandshake className="h-6 w-6 text-primary" />
            客户中心 (医院病人管理)
          </CardTitle>
          <CardDescription>
            查看和管理由各企业/医院服务的最终客户（病人）信息。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            平台管理员通常在此处进行客户数据的宏观查看和管理，具体操作可能由企业/医院员工在其账户内完成。SAAS管理员可能需要：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>查看所有企业/医院的客户（病人）汇总列表。</li>
            <li>按所属企业/医院、疾病类型等条件筛选和搜索客户。</li>
            <li>管理客户账户（如合并重复账户、处理异常账户）。</li>
            <li>查看客户的关键健康数据摘要（需有相应权限和脱敏处理）。</li>
            <li>导出客户数据统计报告（如按疾病分布、年龄分布等）。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <HeartHandshake className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">客户（病人）信息管理功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含病人列表、筛选搜索、账户操作等功能。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
