
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function DoctorSalesSettlementPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <DollarSign className="mr-3 h-7 w-7 text-primary" />
            销售结算
          </CardTitle>
          <CardDescription>
            查看您的商品销售业绩、提成明细和结算信息 (功能建设中)。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-muted-foreground">销售结算功能正在开发中。</p>
            <p className="text-xs text-muted-foreground mt-2">此页面将展示您的销售数据、佣金计算以及提现或结算记录。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
