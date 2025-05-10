import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple } from "lucide-react";

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Apple className="mr-3 h-7 w-7 text-primary" />
            营养管理
          </CardTitle>
          <CardDescription>
            搜索食物、记录三餐并获取营养分析和饮食建议。 (此页面内容正在建设中)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            食物数据库、三餐记录和营养分析功能将在此处提供。
          </p>
           <div className="mt-8 flex flex-col items-center text-center">
            <Apple className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">即将推出</h3>
            <p className="text-foreground/50 max-w-md">
              我们正在努力开发食物数据库和膳食跟踪功能，为您带来更全面的营养管理体验。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
