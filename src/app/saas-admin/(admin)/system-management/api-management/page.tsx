
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, KeyRound, ShieldAlert } from "lucide-react";

export default function ApiManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Network className="h-6 w-6 text-primary" />
            API管理
          </CardTitle>
          <CardDescription>
            管理系统对外提供的API接口及其访问权限和安全设置。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            此模块用于管理和维护系统API接口：
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>查看系统可用的API接口列表及其文档。</li>
            <li>生成和管理API密钥（API Keys）或OAuth凭证，用于外部应用或服务接入。</li>
            <li>配置API接口的访问权限、速率限制和安全策略。</li>
            <li>监控API调用日志、分析使用情况和性能。</li>
            <li>版本控制和废弃旧版API接口。</li>
          </ul>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <div className="flex justify-center items-center space-x-4 text-muted-foreground mb-2">
                <KeyRound className="h-8 w-8" />
                <ShieldAlert className="h-8 w-8" />
            </div>
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">API接口列表、密钥管理和权限配置功能正在建设中。</p>
            <p className="text-xs text-muted-foreground mt-1">将包含API文档链接、密钥生成/管理界面、权限设置等。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```