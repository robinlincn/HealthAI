
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
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <HeartHandshake className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">客户中心功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              平台管理员将能在此处查看和管理所有企业/医院的客户（病人）汇总信息。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
