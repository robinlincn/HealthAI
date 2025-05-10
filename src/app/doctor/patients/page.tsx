
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function DoctorPatientsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Users className="mr-3 h-7 w-7 text-primary" />
            患者管理
          </CardTitle>
          <CardDescription>
            查看、搜索和管理您的患者列表、病历及治疗进展。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-8 flex flex-col items-center text-center">
            <Users className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">功能建设中</h3>
            <p className="text-foreground/50 max-w-md">
              详细的患者列表、搜索、筛选以及患者档案管理功能即将在此页面推出。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
