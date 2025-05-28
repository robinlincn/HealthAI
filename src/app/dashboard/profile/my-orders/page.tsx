
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";

export default function MyOrdersPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <ListOrdered className="mr-2 h-5 w-5 text-primary" />
            我的订单
          </CardTitle>
          <CardDescription className="text-xs">
            查看您在商城购买的商品订单。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <ListOrdered className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
          <p className="text-xs text-foreground/50 max-w-xs mx-auto">
            您将在此处查看您的订单列表、订单详情和物流状态。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
