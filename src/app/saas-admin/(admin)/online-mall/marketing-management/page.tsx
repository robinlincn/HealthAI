
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function MarketingManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Megaphone className="h-6 w-6 text-primary" />
            营销管理
          </CardTitle>
          <CardDescription>
            创建和管理商城的营销活动，如优惠券、促销、团购等。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">营销管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于配置和管理各类商城营销工具和活动。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
