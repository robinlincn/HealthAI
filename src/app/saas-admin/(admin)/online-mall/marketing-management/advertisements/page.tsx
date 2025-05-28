
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Presentation } from "lucide-react";

export default function AdvertisementManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Presentation className="h-6 w-6 text-primary" />
            广告管理
          </CardTitle>
          <CardDescription>
            设置广告位，管理广告内容，支持图片、视频等多种广告形式。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Presentation className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">广告管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将用于配置商城内的广告位、上传广告素材及设置投放规则。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
