
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Filter, PlusCircle, ExternalLink, List, LogIn } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import type { DateRange } from "react-day-picker";
import { useState } from "react";

export default function CommunityManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroupType, setFilterGroupType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button disabled className="w-full sm:w-auto">
                    <LogIn className="mr-2 h-4 w-4"/> 连接个人微信 (开发中)
                </Button>
                <Button disabled className="w-full sm:w-auto">
                     <LogIn className="mr-2 h-4 w-4"/> 连接企业微信 (开发中)
                </Button>
                <p className="text-xs text-muted-foreground sm:ml-auto">
                    确保您已授权本应用访问相关微信数据。
                </p>
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
                            disabled
                        />
                    </div>
                    <Select value={filterGroupType} onValueChange={setFilterGroupType} disabled>
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
                        <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full" disabled />
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
                <div className="mt-2 p-8 border border-dashed border-border rounded-md text-center bg-muted/30 min-h-[200px] flex flex-col justify-center items-center">
                    <List className="h-16 w-16 mx-auto text-primary/20 mb-3" />
                    <p className="text-lg font-semibold text-muted-foreground">聊天记录展示区 (开发中)</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    连接微信账户后，同步的群聊记录和日志将在此处展示。您将能够查看消息内容、发送者、时间等信息。
                    </p>
                </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
