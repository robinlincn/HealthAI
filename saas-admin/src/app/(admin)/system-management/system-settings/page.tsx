
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Settings2 } from "lucide-react";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings2 className="h-6 w-6 text-primary" />
            系统设置
          </CardTitle>
          <CardDescription>
            配置SAAS平台的全局设置，如默认主题、通知模板、系统维护模式等。
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Settings2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">系统设置功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于SAAS平台的全局配置，如界面、通知、维护等。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
