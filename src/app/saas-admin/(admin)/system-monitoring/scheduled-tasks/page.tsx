
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function ScheduledTasksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Clock className="h-6 w-6 text-primary" />
            定时任务管理
          </CardTitle>
          <CardDescription>
            管理和监控系统中的定时任务，如数据备份、报告生成、消息推送等。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">定时任务管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于管理系统后台运行的定时计划任务。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
