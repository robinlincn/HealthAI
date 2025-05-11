import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ShoppingCart, ListOrdered } from "lucide-react";

export default function OrderManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="h-6 w-6 text-primary" />
            订单管理
          </CardTitle>
          <CardDescription>
            查看和管理企业/医院购买服务包的订单记录。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此功能用于跟踪和管理服务包的销售订单：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>查看所有订单列表，包括订单号、购买企业/医院、服务包名称、金额、支付状态、订单时间等。</li>
            <li>按订单状态（待支付、已支付、已完成、已取消）、企业名称、服务包类型等条件筛选和搜索订单。</li>
            <li>管理订单状态（如确认支付、标记完成、处理退款等）。</li>
            <li>生成订单相关的统计报告。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">订单列表、状态管理和筛选功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含订单表格、筛选器、订单详情查看等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
