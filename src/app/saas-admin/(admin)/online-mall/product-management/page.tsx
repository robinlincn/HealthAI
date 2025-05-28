
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";

export default function ProductManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PackageSearch className="h-6 w-6 text-primary" />
            商品管理
          </CardTitle>
          <CardDescription>
            管理在线商城中的商品信息，包括添加、编辑、删除商品，设置价格、库存等。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">商品管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于管理商城的商品列表、分类、规格、价格和库存。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
