
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Contact } from "lucide-react";

export default function MembershipManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Contact className="h-6 w-6 text-primary" />
            会员管理
          </CardTitle>
          <CardDescription>
            管理商城会员信息、等级、积分和权益。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Contact className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">会员管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于管理商城注册会员，设置会员等级、积分规则和会员权益。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
