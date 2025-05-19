
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Filter, PlusCircle, ExternalLink, List, LogIn, CheckCircle, AlertTriangle } from "lucide-react";
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";
import { useToast } from '@/hooks/use-toast'; 
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, subDays } from "date-fns";

interface WeChatAccount {
  id: string;
  type: 'personal' | 'enterprise';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

interface ChatLogEntry {
  id: string;
  groupId: string;
  groupName: string;
  senderName: string;
  message: string;
  timestamp: string;
  isBot: boolean;
}

const mockWeChatAccounts: WeChatAccount[] = [
  { id: 'wc-pers-001', type: 'personal', name: '我的个人微信', status: 'connected', lastSync: subDays(new Date(), 1).toISOString() },
  { id: 'wc-ent-001', type: 'enterprise', name: '公司企业微信', status: 'disconnected' },
];

const mockChatLogs: ChatLogEntry[] = [
  { id: 'log-001', groupId: 'group-a', groupName: 'VIP客户交流群', senderName: '张三', message: '请问最近有什么新的优惠活动吗？', timestamp: subDays(new Date(), 0.5).toISOString(), isBot: false},
  { id: 'log-002', groupId: 'group-a', groupName: 'VIP客户交流群', senderName: 'AI小助手', message: '您好张三，目前我们有针对老客户的XXX活动，详情请看链接...', timestamp: subDays(new Date(), 0.4).toISOString(), isBot: true},
  { id: 'log-003', groupId: 'group-b', groupName: '产品反馈群', senderName: '李四', message: 'APP的某个功能好像有点问题。', timestamp: subDays(new Date(), 1).toISOString(), isBot: false},
];

export default function CommunityManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroupType, setFilterGroupType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [weChatAccounts, setWeChatAccounts] = useState<WeChatAccount[]>(mockWeChatAccounts);
  const [chatLogs, setChatLogs] = useState<ChatLogEntry[]>(mockChatLogs);
  const { toast } = useToast();

  const handleConnectWeChat = (type: 'personal' | 'enterprise') => {
    toast({ title: "模拟连接", description: `正在尝试连接${type === 'personal' ? '个人' : '企业'}微信... (此为模拟操作)`});
    // Simulate connection logic
    setTimeout(() => {
        setWeChatAccounts(prev => prev.map(acc => acc.type === type ? {...acc, status: 'connected', lastSync: new Date().toISOString()} : acc));
        toast({ title: "连接成功 (模拟)", description: `${type === 'personal' ? '个人' : '企业'}微信已连接。` });
    }, 2000);
  };

  const handleSyncLogs = (accountId: string) => {
     toast({ title: "模拟同步", description: "正在同步聊天记录... (此为模拟操作)"});
     setTimeout(() => {
        setWeChatAccounts(prev => prev.map(acc => acc.id === accountId ? {...acc, lastSync: new Date().toISOString()} : acc));
        // Add new mock logs or indicate sync happened
        setChatLogs(prev => [...prev, {id: `log-${Date.now()}`, groupId: 'group-sync', groupName: '新同步群聊', senderName: '系统同步', message: '日志同步完成。', timestamp: new Date().toISOString(), isBot: true}]);
        toast({ title: "同步完成 (模拟)", description: "聊天记录已更新。" });
    }, 2500);
  }

  const getStatusBadge = (status: WeChatAccount['status']) => {
     switch (status) {
      case 'connected': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1"/>已连接</Badge>;
      case 'disconnected': return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1"/>未连接</Badge>;
      case 'error': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1"/>连接错误</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            社群管理
          </CardTitle>
          <CardDescription>
            记录和管理微信群聊天记录和日志，包括个人微信群和企业微信群。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">微信集成管理</CardTitle>
                <CardDescription className="text-sm">连接和管理您的微信账户以同步聊天记录。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {weChatAccounts.map(acc => (
                    <div key={acc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md">
                        <div>
                            <p className="font-medium">{acc.name} ({acc.type === 'personal' ? '个人微信' : '企业微信'})</p>
                            <div className="text-xs text-muted-foreground"> {/* Changed p to div here */}
                                状态: {getStatusBadge(acc.status)}
                                {acc.status === 'connected' && acc.lastSync && (
                                    <span className="ml-2">上次同步: {format(new Date(acc.lastSync), "yyyy-MM-dd HH:mm")}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            {acc.status !== 'connected' ? (
                                <Button size="sm" onClick={() => handleConnectWeChat(acc.type)}>
                                    <LogIn className="mr-2 h-4 w-4"/> 连接
                                </Button>
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => handleSyncLogs(acc.id)}>
                                    同步日志
                                </Button>
                            )}
                            <Button size="sm" variant="outline" disabled>管理</Button>
                        </div>
                    </div>
                ))}
                 <Button onClick={() => toast({title: "提示", description:"添加新微信账户功能开发中。"})} variant="outline" size="sm" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4"/> 添加微信账户
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-lg">聊天记录筛选与搜索</CardTitle>
                 <CardDescription className="text-sm">按条件查找特定的聊天记录或群组。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="搜索群名称、成员、内容..."
                            className="pl-8 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterGroupType} onValueChange={setFilterGroupType}>
                        <SelectTrigger>
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground"/>
                            <SelectValue placeholder="筛选群类型" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">所有群类型</SelectItem>
                            <SelectItem value="personal">个人微信群</SelectItem>
                            <SelectItem value="enterprise">企业微信群</SelectItem>
                        </SelectContent>
                    </Select>
                     <div>
                        <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full" />
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">聊天记录与日志</CardTitle>
                <CardDescription className="text-sm">下方将显示同步的聊天记录和相关操作日志。</CardDescription>
            </CardHeader>
            <CardContent>
                {chatLogs.length > 0 ? (
                    <ScrollArea className="h-[300px] border rounded-md p-3">
                        <div className="space-y-3">
                            {chatLogs.filter(log => log.groupName.toLowerCase().includes(searchTerm.toLowerCase()) || log.senderName.toLowerCase().includes(searchTerm.toLowerCase()) || log.message.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(log => (
                                <div key={log.id} className={`p-2 rounded-md ${log.isBot ? 'bg-primary/10' : 'bg-muted/50'}`}>
                                    <div className="flex justify-between items-center text-xs mb-0.5">
                                        <span className="font-semibold">{log.senderName} @ {log.groupName}</span>
                                        <span className="text-muted-foreground">{format(new Date(log.timestamp), "MM-dd HH:mm")}</span>
                                    </div>
                                    <p className="text-sm">{log.message}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="mt-2 p-8 border border-dashed border-border rounded-md text-center bg-muted/30 min-h-[200px] flex flex-col justify-center items-center">
                        <List className="h-16 w-16 mx-auto text-primary/20 mb-3" />
                        <p className="text-lg font-semibold text-muted-foreground">暂无聊天记录</p>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        请先连接微信账户并同步日志。
                        </p>
                    </div>
                )}
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}

