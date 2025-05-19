
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatabaseBackup, RotateCcw, DownloadCloud, UploadCloud, History, ListChecks, Server, Clock4, CheckCircle, XCircle, AlertTriangle } from "lucide-react"; // Added missing icons
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { format, parseISO, subHours, subDays } from 'date-fns'; // Ensure parseISO is imported
import { Badge } from '@/components/ui/badge';

interface BackupRecord {
  id: string;
  timestamp: string;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
  size?: string; // e.g., "2.5 GB"
  notes?: string;
}

const mockBackupHistory: BackupRecord[] = [
  { id: 'backup-003', timestamp: subHours(new Date(), 2).toISOString(), type: 'automatic', status: 'completed', size: '2.4 GB', notes: '每日自动备份' },
  { id: 'backup-002', timestamp: subDays(new Date(), 1).toISOString(), type: 'manual', status: 'completed', size: '2.3 GB', notes: '版本更新前备份' },
  { id: 'backup-001', timestamp: subDays(new Date(), 7).toISOString(), type: 'automatic', status: 'failed', notes: '存储空间不足' },
];

export default function SaasBackupPage() {
  const { toast } = useToast();
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>(mockBackupHistory);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleManualBackup = () => {
    toast({ title: "SAAS平台手动备份已启动 (模拟)", description: "数据正在备份中，请稍候..." });
    // Simulate backup process
    setTimeout(() => {
      const newBackup: BackupRecord = {
        id: `backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'manual',
        status: 'completed',
        size: `${(Math.random() * 0.5 + 2).toFixed(1)} GB`,
        notes: '手动触发备份'
      };
      setBackupHistory(prev => [newBackup, ...prev]);
      toast({ title: "备份成功", description: "手动数据备份已完成。" });
    }, 3000);
  };

  const handleDataRestore = (backupId: string) => {
    if(window.confirm(`确定要从备份 ${backupId} 恢复数据吗？此操作将覆盖当前平台数据，请谨慎操作！`)) {
      toast({ title: "SAAS平台数据恢复 (模拟)", description: `正在从备份 ${backupId} 恢复数据...`, variant: "destructive" });
      // Simulate restore
      setTimeout(() => {
         toast({ title: "恢复完成 (模拟)", description: `数据已从备份 ${backupId} 成功恢复。平台可能需要重启。`, duration: 7000 });
      }, 5000);
    }
  };
  
  const getStatusBadge = (status: BackupRecord['status']) => {
    switch(status) {
        case 'completed': return <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle className="h-3 w-3 mr-1"/>已完成</Badge>;
        case 'failed': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300"><XCircle className="h-3 w-3 mr-1"/>失败</Badge>;
        case 'in_progress': return <Badge className="bg-blue-100 text-blue-700 border-blue-300 animate-pulse"><Clock4 className="h-3 w-3 mr-1"/>进行中</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>数据备份与恢复</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载备份数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <DatabaseBackup className="h-6 w-6 text-primary" />
            数据备份与恢复 (SAAS平台)
          </CardTitle>
          <CardDescription>
            管理SAAS平台的核心数据备份、恢复策略和历史记录。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Server className="mr-2 h-5 w-5 text-muted-foreground"/>自动备份设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoBackupSwitch" className="text-sm font-medium">启用自动备份</Label>
                <Switch id="autoBackupSwitch" checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
              </div>
              {autoBackupEnabled && (
                <div>
                  <Label htmlFor="backupFrequencySelect" className="text-sm font-medium">备份频率</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger id="backupFrequencySelect" className="mt-1">
                      <SelectValue placeholder="选择备份频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每日</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={() => toast({title:"提示", description:"自动备份设置保存功能开发中。"})} disabled={!autoBackupEnabled}>保存自动备份设置</Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>手动备份</CardTitle>
                <CardDescription>立即触发一次平台数据备份。</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center space-y-3">
                <DownloadCloud className="w-16 h-16 text-primary/70" />
                <Button onClick={handleManualBackup} className="w-full">
                  <DatabaseBackup className="mr-2 h-4 w-4" /> 启动平台备份
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>从备份恢复</CardTitle>
                <CardDescription>选择一个历史备份进行数据恢复。</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center space-y-3">
                 <UploadCloud className="w-16 h-16 text-destructive/70" />
                <Button onClick={() => toast({title:"提示", description:"从特定备份文件恢复功能开发中。请从下方历史记录中选择恢复。"})} variant="outline" className="w-full">
                  <UploadCloud className="mr-2 h-4 w-4" /> 选择备份文件恢复
                </Button>
                <p className="text-xs text-destructive">警告: 数据恢复将覆盖当前平台数据，请谨慎操作。</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5 text-muted-foreground"/>备份历史记录</CardTitle>
            </CardHeader>
            <CardContent>
                {backupHistory.length > 0 ? (
                    <div className="overflow-x-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>时间</TableHead>
                                    <TableHead>类型</TableHead>
                                    <TableHead>状态</TableHead>
                                    <TableHead>大小</TableHead>
                                    <TableHead>备注</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backupHistory.map(b => (
                                    <TableRow key={b.id}>
                                        <TableCell>{isClient ? format(parseISO(b.timestamp), 'yyyy-MM-dd HH:mm') : '...'}</TableCell>
                                        <TableCell>{b.type === 'manual' ? '手动' : '自动'}</TableCell>
                                        <TableCell>{getStatusBadge(b.status)}</TableCell>
                                        <TableCell>{b.size || '-'}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={b.notes || undefined}>{b.notes || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDataRestore(b.id)} 
                                                disabled={b.status !== 'completed'}
                                                className="text-xs h-7"
                                            >
                                                <RotateCcw className="mr-1 h-3 w-3"/> 恢复此备份
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                             {backupHistory.length > 3 && <TableCaption>共 {backupHistory.length} 条备份记录。</TableCaption>}
                        </Table>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">暂无备份历史记录。</p>
                )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
