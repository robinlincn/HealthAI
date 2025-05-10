
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatabaseBackup, RotateCcw, DownloadCloud, UploadCloud, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorSettingsBackupPage() {
  const { toast } = useToast();

  const handleManualBackup = () => {
    toast({ title: "手动备份已启动 (模拟)", description: "数据正在备份中，完成后将提供下载链接。" });
  };

  const handleDataRestore = () => {
    // This would typically involve a file selector and confirmation
    toast({ title: "数据恢复流程 (模拟)", description: "请选择备份文件进行恢复。此操作风险较高，请谨慎。", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <DatabaseBackup className="mr-3 h-7 w-7 text-primary" />
            数据备份与恢复
          </CardTitle>
          <CardDescription>
            管理系统数据的自动和手动备份，以及在需要时从备份文件恢复数据。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>自动备份设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoBackupSwitch" className="text-base">启用自动备份</Label>
            <Switch id="autoBackupSwitch" defaultChecked />
          </div>
          <div>
            <Label htmlFor="backupFrequency" className="block text-sm font-medium mb-1">备份频率</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="backupFrequency" className="w-[200px]">
                <SelectValue placeholder="选择频率" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">每日</SelectItem>
                <SelectItem value="weekly">每周</SelectItem>
                <SelectItem value="monthly">每月</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">自动备份将在服务器负载较低时执行。详细配置功能建设中。</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>手动备份</CardTitle>
            <CardDescription>随时手动触发一次完整数据备份。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-3">
            <DownloadCloud className="w-16 h-16 text-primary/70" />
            <Button onClick={handleManualBackup} className="w-full">
              <DatabaseBackup className="mr-2 h-4 w-4" /> 开始手动备份
            </Button>
            <p className="text-xs text-muted-foreground">备份文件将包含所有病人数据、配置等。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据恢复</CardTitle>
            <CardDescription>从已有的备份文件恢复系统数据。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-3">
            <UploadCloud className="w-16 h-16 text-destructive/70" />
            <Button onClick={handleDataRestore} variant="destructive" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> 从备份恢复数据
            </Button>
            <p className="text-xs text-destructive">警告: 数据恢复将覆盖当前所有数据，请务必谨慎操作并在安全环境下进行。</p>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5 text-muted-foreground"/>备份历史记录</CardTitle>
            <CardDescription>查看最近的备份记录和状态。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">备份历史列表功能正在建设中。</p>
            {/* Placeholder for list */}
            <ul className="mt-2 text-sm space-y-1">
                <li className="text-muted-foreground">2024-05-15 02:00 - 自动备份 - 成功</li>
                <li className="text-muted-foreground">2024-05-10 11:30 - 手动备份 - 成功</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
