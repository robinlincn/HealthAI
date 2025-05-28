
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";

export default function DoctorProductSalesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PackageSearch className="mr-3 h-7 w-7 text-primary" />
            商品列表与销售
          </CardTitle>
          <CardDescription>
            浏览由SAAS平台分配给本机构的可销售商品，并进行销售操作 (功能建设中)。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-muted-foreground">商品列表和销售功能正在开发中。</p>
            <p className="text-xs text-muted-foreground mt-2">此页面将显示可销售的医疗器械、膳食包、药膳包等，并提供开单或生成购买链接的功能。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
