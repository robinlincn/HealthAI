
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function CouponManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Ticket className="h-6 w-6 text-primary" />
            优惠券管理
          </CardTitle>
          <CardDescription>
            生成、发放优惠券，设置优惠券的使用条件和有效期。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">优惠券管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于创建、管理和跟踪优惠券的发行与使用情况。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
