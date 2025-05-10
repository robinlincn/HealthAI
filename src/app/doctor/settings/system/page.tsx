
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Palette, BellRing, ServerCog, Brush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorSettingsSystemPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Settings2 className="mr-3 h-7 w-7 text-primary" />
            系统设置
          </CardTitle>
          <CardDescription>
            配置系统界面、通知方式以及进行系统维护操作。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-muted-foreground"/>界面设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="themeColor" className="block text-sm font-medium mb-1">主题颜色</Label>
              <div className="flex items-center space-x-2">
                <Input type="color" id="themeColor" defaultValue="#008080" className="w-12 h-10 p-1" disabled/>
                <span className="text-sm text-muted-foreground">(颜色选择器功能建设中)</span>
              </div>
            </div>
            <div>
                <Label htmlFor="layoutDensity" className="block text-sm font-medium mb-1">界面密度</Label>
                <Select defaultValue="default" disabled>
                    <SelectTrigger id="layoutDensity"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="compact">紧凑</SelectItem>
                        <SelectItem value="default">标准</SelectItem>
                        <SelectItem value="comfortable">舒适</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" disabled><Brush className="mr-2 h-4 w-4"/>应用界面更改</Button>
            <p className="text-xs text-muted-foreground">自定义界面布局、主题等功能正在开发中。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BellRing className="mr-2 h-5 w-5 text-muted-foreground"/>通知设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotify" className="text-base">邮件通知新咨询</Label>
              <Switch id="emailNotify" defaultChecked disabled/>
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="smsNotify" className="text-base">短信通知紧急预警 (需配置)</Label>
              <Switch id="smsNotify" disabled/>
            </div>
            <div>
              <Label htmlFor="notificationSound" className="block text-sm font-medium mb-1">新消息提示音</Label>
               <Select defaultValue="default_sound" disabled>
                    <SelectTrigger id="notificationSound"><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default_sound">默认提示音</SelectItem>
                        <SelectItem value="gentle_chime">轻柔铃声</SelectItem>
                        <SelectItem value="none">无提示音</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <p className="text-xs text-muted-foreground">更多通知方式和自定义内容模板功能正在建设中。</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><ServerCog className="mr-2 h-5 w-5 text-muted-foreground"/>系统维护</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline" disabled>检查系统更新</Button>
            <Button className="w-full" variant="outline" disabled>清理系统缓存</Button>
            <Button className="w-full" variant="destructive" disabled>重启应用服务 (维护模式)</Button>
            <p className="text-xs text-muted-foreground">系统日志查看、插件管理等高级维护功能建设中。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
