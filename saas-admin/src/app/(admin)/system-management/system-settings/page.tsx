import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Cog, Palette, BellRing, ServerCog } from "lucide-react";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Cog className="h-6 w-6 text-primary" />
            系统设置
          </CardTitle>
          <CardDescription>
            配置SAAS平台的全局设置，如默认主题、通知模板、系统维护模式等。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此模块用于SAAS平台的全局配置：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>界面设置：配置SAAS管理后台的默认主题颜色、Logo、布局等。</li>
            <li>通知设置：管理系统级通知的方式（邮件、短信网关配置）和模板内容。</li>
            <li>系统维护：启用/禁用系统维护模式，进行计划内停机维护。</li>
            <li>配置基础参数：如默认时区、语言、货币等。</li>
            <li>许可证管理、计费与订阅设置（如有）。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <Palette className="h-8 w-8" />
                <BellRing className="h-8 w-8" />
                <ServerCog className="h-8 w-8" />
            </div>
            <Cog className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">全局系统配置功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含各类配置表单、选项开关等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
