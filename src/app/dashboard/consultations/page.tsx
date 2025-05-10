import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ConsultationsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MessageSquare className="mr-3 h-7 w-7 text-primary" />
            医生咨询记录
          </CardTitle>
          <CardDescription>
            查看您的历史咨询记录和医生的回复。(此页面内容正在建设中)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            咨询列表、咨询详情和回复功能将在此处提供。
          </p>
          <div className="mt-8 flex flex-col items-center text-center">
            <MessageSquare className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">即将推出</h3>
            <p className="text-foreground/50 max-w-md">
              我们正在开发医生咨询模块，方便您查阅历史记录。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
