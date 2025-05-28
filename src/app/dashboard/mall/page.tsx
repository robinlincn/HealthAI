
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function OnlineMallPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-xl flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
            在线商城
          </CardTitle>
          <CardDescription className="text-sm">
            浏览和购买推荐的健康商品、器械和营养膳食。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center min-h-[300px] flex flex-col justify-center items-center">
          <ShoppingCart className="w-24 h-24 text-primary/20 mb-6" />
          <h3 className="text-2xl font-semibold text-foreground/80 mb-2">在线商城即将开放</h3>
          <p className="text-muted-foreground max-w-md">
            我们正在努力搭建在线商城，为您提供更多优质健康产品和服务，敬请期待！
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
