
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";

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
          <p className="text-muted-foreground">
            此模块提供平台当前活动用户的实时概览：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>显示当前在线的总用户数。</li>
            <li>区分不同类型的在线用户（如SAAS管理员、企业员工、客户/病人）。</li>
            <li>展示在线用户列表，包含用户名、所属企业（如适用）、登录时间、最近活动时间等信息。</li>
            <li>支持按用户类型或企业筛选在线用户。</li>
            <li>（可选）强制用户下线功能。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">在线用户实时监控和列表展示功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含实时在线用户数、用户列表表格、筛选器等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```