
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ListOrdered } from "lucide-react"; 

export default function OrderManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ListOrdered className="h-6 w-6 text-primary" />
            订单管理
          </CardTitle>
          <CardDescription>
            查看和管理企业/医院购买服务包的订单记录。
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">订单管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此功能将用于跟踪和管理服务包的销售订单，包括订单状态和支付信息。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
