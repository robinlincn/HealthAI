import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react"; // Using Bell for notifications

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bell className="mr-3 h-7 w-7 text-primary" />
            消息通知
          </CardTitle>
          <CardDescription>
            查看系统发送给您的个性化消息和提醒。(此页面内容正在建设中)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            您的消息通知列表将在此处显示。
          </p>
          <div className="mt-8 flex flex-col items-center text-center">
            <Bell className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">即将推出</h3>
            <p className="text-foreground/50 max-w-md">
              消息中心正在建设中，敬请期待重要的健康提醒和通知。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
