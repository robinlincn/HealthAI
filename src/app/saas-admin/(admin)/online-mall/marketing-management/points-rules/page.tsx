
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function PointsRulesManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-primary" />
            积分营销管理
          </CardTitle>
          <CardDescription>
            设置积分获取和兑换规则，利用积分吸引用户消费和互动。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">积分营销规则管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于定义积分的获取方式、兑换比例、可用商品等。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
