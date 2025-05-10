
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function DoctorMessagesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Mail className="mr-3 h-7 w-7 text-primary" />
            消息通知 (医生端)
          </CardTitle>
          <CardDescription>
            查看来自患者的消息、系统通知和重要提醒。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-8 flex flex-col items-center text-center">
            <Mail className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">功能建设中</h3>
            <p className="text-foreground/50 max-w-md">
              患者消息列表、回复功能以及系统警报和通知中心即将在此页面推出。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
