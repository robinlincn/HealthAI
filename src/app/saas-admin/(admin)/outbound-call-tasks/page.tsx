
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send } from "lucide-react";

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
           <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Send className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">外呼任务功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此功能将用于创建、管理和跟踪自动或人工外呼任务。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
