
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Palette, BellRing, ShieldAlert, ServerCrash, Languages, Clock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    platformName: "AI慢病管理SAAS平台",
    defaultTheme: "light",
    maintenanceMode: false,
    defaultLanguage: "zh-CN",
    sessionTimeout: 30, // minutes
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({...prev, [name]: checked}));
  };

  const handleSaveChanges = () => {
    console.log("Saving system settings:", settings);
    toast({ title: "设置已保存 (模拟)", description: "系统设置已更新。" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings2 className="h-6 w-6 text-primary" />
            系统设置
          </CardTitle>
          <CardDescription>
            配置SAAS平台的全局参数、默认行为和维护选项。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><Palette className="mr-2 h-5 w-5"/>平台基础设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="platformName">平台名称</Label>
                    <Input id="platformName" name="platformName" value={settings.platformName} onChange={handleInputChange} />
                </div>
                <div>
                    <Label htmlFor="defaultTheme">默认主题</Label>
                    <Select name="defaultTheme" value={settings.defaultTheme} onValueChange={(value) => handleSelectChange("defaultTheme", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">浅色模式</SelectItem>
                            <SelectItem value="dark">深色模式</SelectItem>
                            <SelectItem value="system">跟随系统</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="defaultLanguage">默认语言</Label>
                    <Select name="defaultLanguage" value={settings.defaultLanguage} onValueChange={(value) => handleSelectChange("defaultLanguage", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="zh-CN">简体中文</SelectItem>
                            <SelectItem value="en-US">English (US)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><BellRing className="mr-2 h-5 w-5"/>通知与邮件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="smtpServer">SMTP服务器地址</Label>
                    <Input id="smtpServer" placeholder="smtp.example.com" disabled />
                </div>
                 <div>
                    <Label htmlFor="adminEmail">管理员邮箱 (用于接收系统通知)</Label>
                    <Input id="adminEmail" type="email" placeholder="admin@saas.com" />
                </div>
                 <p className="text-xs text-muted-foreground">邮件服务器、短信网关等配置功能正在开发中。</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><ShieldAlert className="mr-2 h-5 w-5"/>安全与维护</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceMode" className="flex-grow">启用维护模式</Label>
                    <Switch id="maintenanceMode" name="maintenanceMode" checked={settings.maintenanceMode} onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)} />
                </div>
                 <FormDescription className="text-xs -mt-2">启用后，普通用户将无法访问平台，仅管理员可见。</FormDescription>
                
                <div>
                    <Label htmlFor="sessionTimeout">会话超时时间 (分钟)</Label>
                    <Input id="sessionTimeout" name="sessionTimeout" type="number" value={settings.sessionTimeout} onChange={handleInputChange} />
                </div>
                 <Button variant="destructive" disabled className="w-full"><ServerCrash className="mr-2 h-4 w-4"/>清理系统缓存</Button>
            </CardContent>
        </Card>
      </div>
       <div className="flex justify-end mt-6">
            <Button onClick={handleSaveChanges}>保存所有设置</Button>
        </div>
    </div>
  );
}
