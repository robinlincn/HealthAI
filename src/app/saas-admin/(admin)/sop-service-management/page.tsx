
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SlidersHorizontal, Settings2, Activity } from "lucide-react"; 

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
          <p className="text-muted-foreground">
            此模块用于配置和监控与AI工作流平台（如Coze、Dify）的集成：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>配置API调用参数：如API密钥、端点URL、模型选择等。</li>
            <li>监控API调用情况：记录调用次数、成功率、响应时间、费用等。</li>
            <li>管理和优化API调用流程，例如设置重试机制、超时时间等。</li>
            <li>查看API调用日志和错误报告。</li>
            <li>可能涉及工作流模板的管理和分发。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <Settings2 className="h-8 w-8" />
                <Activity className="h-8 w-8" />
            </div>
            <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Coze、Dify等工作流API集成和管理功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含API配置表单、调用日志表格、监控图表等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```