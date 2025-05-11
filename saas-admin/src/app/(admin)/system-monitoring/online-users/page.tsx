
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users } from "lucide-react";

export default function OnlineUsersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            在线用户
          </CardTitle>
          <CardDescription>
            实时获取SAAS平台当前在线用户数量和列表（包括企业端用户和病人端用户）。
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">在线用户监控功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将提供平台当前活动用户的实时概览。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
