import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function TreatmentPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ClipboardList className="mr-3 h-7 w-7 text-primary" />
            个性化治疗方案
          </CardTitle>
          <CardDescription>
            管理您的药物、治疗计划及调整记录。(此页面内容正在建设中)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            药物管理、治疗计划详情和调整记录功能将在此处提供。
          </p>
          <div className="mt-8 flex flex-col items-center text-center">
            <ClipboardList className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">即将推出</h3>
            <p className="text-foreground/50 max-w-md">
              我们正在开发治疗方案管理模块，敬请期待。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
