
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

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
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">社群管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于接入和管理微信等社群的聊天记录和日志。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
