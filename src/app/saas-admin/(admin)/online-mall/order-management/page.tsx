
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Receipt } from "lucide-react"; 

export default function MallOrderManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Receipt className="h-6 w-6 text-primary" />
            订单管理 (商城)
          </CardTitle>
          <CardDescription>
            查看和管理在线商城中的商品订单记录，处理订单状态、发货等。
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">商城订单管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此功能将用于跟踪和管理商城商品订单，包括支付、发货和售后。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
