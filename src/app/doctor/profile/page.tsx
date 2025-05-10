
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export default function DoctorProfilePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserCircle className="mr-3 h-7 w-7 text-primary" />
            医生资料管理
          </CardTitle>
          <CardDescription>
            查看和更新您的个人执业信息、专业背景和账户设置。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-8 flex flex-col items-center text-center">
            <UserCircle className="w-24 h-24 text-primary/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground/70">功能建设中</h3>
            <p className="text-foreground/50 max-w-md">
              医生个人信息编辑、资质认证上传、专业领域设置等功能即将在此页面推出。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
