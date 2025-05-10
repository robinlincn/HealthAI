
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Palette, BellRing, DatabaseBackup, DownloadCloud, ShieldLock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleManualBackup = () => {
    toast({ title: "手动备份已启动 (模拟)", description: "数据正在备份中，此功能仅为演示。" });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Settings className="mr-3 h-7 w-7 text-primary" />
            系统设置
          </CardTitle>
          <CardDescription>
            管理您的账户设置、偏好和数据安全选项。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-muted-foreground"/>界面偏好</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="themeSelect" className="block text-sm font-medium mb-1">主题选择</Label>
              <Select defaultValue="system" disabled>
                <SelectTrigger id="themeSelect"><SelectValue placeholder="选择主题" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色模式</SelectItem>
                  <SelectItem value="dark">深色模式</SelectItem>
                  <SelectItem value="system">跟随系统</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">主题切换功能正在开发中。</p>
            </div>
            <div>
              <Label htmlFor="fontSize" className="block text-sm font-medium mb-1">字体大小</Label>
               <Select defaultValue="medium" disabled>
                <SelectTrigger id="fontSize"><SelectValue placeholder="选择字体大小" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">小</SelectItem>
                  <SelectItem value="medium">中 (默认)</SelectItem>
                  <SelectItem value="large">大</SelectItem>
                </SelectContent>
              </Select>
               <p className="text-xs text-muted-foreground mt-1">字体大小调整功能开发中。</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BellRing className="mr-2 h-5 w-5 text-muted-foreground"/>通知设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="text-base">邮件通知</Label>
              <Switch id="emailNotifications" defaultChecked disabled />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="text-base">应用内推送通知</Label>
              <Switch id="pushNotifications" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications" className="text-base">短信通知 (重要)</Label>
              <Switch id="smsNotifications" disabled />
            </div>
            <p className="text-xs text-muted-foreground">精细化通知设置和渠道管理功能正在完善。</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><DatabaseBackup className="mr-2 h-5 w-5 text-muted-foreground"/>数据与安全</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleManualBackup} className="w-full" variant="outline">
              <DownloadCloud className="mr-2 h-4 w-4" /> 手动备份数据 (模拟)
            </Button>
            <Button className="w-full" variant="outline" disabled>
                <ShieldLock className="mr-2 h-4 w-4"/> 修改密码
            </Button>
            <p className="text-xs text-muted-foreground">数据导出、账户安全设置等功能即将推出。</p>
            <p className="text-xs text-muted-foreground mt-2">您的数据会自动同步到云端并进行加密保护。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
