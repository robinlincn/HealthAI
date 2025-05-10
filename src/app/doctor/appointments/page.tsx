
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <CalendarDays className="mr-3 h-7 w-7 text-primary" />
            预约安排
          </CardTitle>
          <CardDescription>
            管理您的预约日历，查看、安排和修改患者的预约。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-8 flex flex-col items-center text-center">
            <CalendarDays className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">功能建设中</h3>
            <p className="text-foreground/50 max-w-md">
              交互式日历、预约列表、新建预约和修改预约功能即将在此页面推出。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
