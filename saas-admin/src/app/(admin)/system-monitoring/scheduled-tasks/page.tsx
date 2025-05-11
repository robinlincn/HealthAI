import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Clock, ListChecks, Play, AlertCircle } from "lucide-react";

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
          <p className="text-muted-foreground">
            此模块用于管理系统后台运行的定时计划任务：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>查看所有已配置的定时任务列表，包括任务名称、执行频率、下次执行时间、最近执行状态等。</li>
            <li>创建、编辑、删除定时任务。</li>
            <li>手动触发某个定时任务立即执行。</li>
            <li>查看任务的执行日志和错误信息。</li>
            <li>监控任务执行状态，对失败的任务进行告警。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <ListChecks className="h-8 w-8" />
                <Play className="h-8 w-8" />
                <AlertCircle className="h-8 w-8" />
            </div>
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">定时任务配置、监控和日志查看功能正在建设中。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
