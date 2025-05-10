
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Keep Card for sections
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, BellRing, DatabaseBackup, DownloadCloud, Shield, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleManualBackup = () => {
    toast({ title: "手动备份已启动 (模拟)", description: "数据正在备份中，此功能仅为演示。" });
  };

  return (
    <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/>界面偏好</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="themeSelect" className="text-sm">主题选择</Label>
              <Select defaultValue="system" disabled>
                <SelectTrigger id="themeSelect" className="w-[150px] h-8 text-xs"><SelectValue placeholder="选择主题" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色模式</SelectItem>
                  <SelectItem value="dark">深色模式</SelectItem>
                  <SelectItem value="system">跟随系统</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">主题切换功能正在开发中。</p>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="fontSize" className="text-sm">字体大小</Label>
               <Select defaultValue="medium" disabled>
                <SelectTrigger id="fontSize" className="w-[150px] h-8 text-xs"><SelectValue placeholder="选择字体大小" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">小</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="large">大</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">字体大小调整功能开发中。</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center"><BellRing className="mr-2 h-4 w-4 text-muted-foreground"/>通知设置</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="text-sm">邮件通知</Label>
              <Switch id="emailNotifications" defaultChecked disabled />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="text-sm">应用内推送</Label>
              <Switch id="pushNotifications" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications" className="text-sm">短信通知 (重要)</Label>
              <Switch id="smsNotifications" disabled />
            </div>
            <p className="text-xs text-muted-foreground">精细化通知设置开发中。</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center"><DatabaseBackup className="mr-2 h-4 w-4 text-muted-foreground"/>数据与安全</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2.5">
            <Button onClick={handleManualBackup} className="w-full text-sm h-9" variant="outline">
              <DownloadCloud className="mr-1.5 h-4 w-4" /> 手动备份数据 (模拟)
            </Button>
            <Button className="w-full text-sm h-9" variant="outline" disabled>
                <Shield className="mr-1.5 h-4 w-4"/> 修改密码
            </Button>
            <p className="text-xs text-muted-foreground">数据导出、账户安全设置等功能即将推出。</p>
            <p className="text-xs text-muted-foreground mt-1">您的数据会自动同步到云端并进行加密保护。</p>
          </CardContent>
        </Card>
    </div>
  );
}
