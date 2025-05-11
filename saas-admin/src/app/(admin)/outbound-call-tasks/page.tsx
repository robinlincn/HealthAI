import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Send, PhoneCall, ListTodo } from "lucide-react";

export default function OutboundCallTasksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Send className="h-6 w-6 text-primary" />
            外呼任务
          </CardTitle>
          <CardDescription>
            设置和管理自动或人工外呼任务，用于客户回访、业务推广、通知提醒等。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此功能用于创建和管理外呼任务：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>设置外呼任务参数：外呼对象（客户或员工列表）、外呼时间窗口、外呼内容或脚本、外呼目的等。</li>
            <li>支持通过系统自动触发（如基于特定事件）或人工批量发起外呼任务。</li>
            <li>记录外呼结果（接通、未接通、用户反馈等）。</li>
            <li>适用于客户回访、满意度调查、业务推广、重要通知提醒等场景。</li>
            <li>可能需要与第三方外呼系统或通讯平台集成。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <PhoneCall className="h-8 w-8" />
                <ListTodo className="h-8 w-8" />
            </div>
            <Send className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">外呼任务设置、执行和结果记录功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含任务创建表单、任务列表、结果统计等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
