
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react"; 

export default function SopServiceManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            SOP服务管理
          </CardTitle>
          <CardDescription>
            管理中台扣子（Coze）、Dify等工作流的API相关内容，优化调用流程。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">SOP服务管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于配置和监控与AI工作流平台（如Coze、Dify）的集成。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
