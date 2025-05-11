
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, ListChecks } from "lucide-react";

export default function CommunityManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            社群管理
          </CardTitle>
          <CardDescription>
            记录和管理微信群聊天记录和日志，包括个人微信群和企业微信群。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此模块用于辅助管理通过微信等社群工具进行的客户互动：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>接入并记录个人微信群或企业微信群的聊天记录（需相应API和授权）。</li>
            <li>对聊天记录进行存档、搜索和分析。</li>
            <li>生成社群活跃度、热门话题等分析报告。</li>
            <li>管理社群相关的日志信息。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">微信群聊天记录接入和管理功能正在建设中，并依赖外部接口能力。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含聊天记录查看器、搜索功能、分析图表等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
