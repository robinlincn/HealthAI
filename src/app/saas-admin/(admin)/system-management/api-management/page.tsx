
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Network, PlusCircle, KeyRound, Edit, Trash2, MoreHorizontal, Search, Copy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast is available in saas-admin scope
import { ScrollArea } from '@/components/ui/scroll-area';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'deprecated' | 'beta' | 'disabled';
  rateLimit?: string;
  description?: string;
  requiredPermissions?: string[];
}

const mockApiEndpoints: ApiEndpoint[] = [
  { id: 'api-001', name: '获取企业列表', path: '/v1/enterprises', method: 'GET', status: 'active', rateLimit: '100/min', description: '查询所有企业账户信息。', requiredPermissions: ['read:enterprises'] },
  { id: 'api-002', name: '创建新企业', path: '/v1/enterprises', method: 'POST', status: 'active', rateLimit: '10/min', description: '注册新的企业账户。', requiredPermissions: ['create:enterprises'] },
  { id: 'api-003', name: '查询病人数据', path: '/v1/patients/{patientId}/health-data', method: 'GET', status: 'beta', description: '获取指定病人的健康数据。', requiredPermissions: ['read:patient_data'] },
  { id: 'api-004', name: '更新服务包配置 (旧版)', path: '/v1/service-packages/{packageId}', method: 'PUT', status: 'deprecated', rateLimit: '50/min', description: '已废弃，请使用 /v2/service-packages。', requiredPermissions: ['update:service_packages'] },
  { id: 'api-005', name: '用户认证接口', path: '/auth/token', method: 'POST', status: 'disabled', description: '用户登录获取令牌。', requiredPermissions: ['public'] },
];

export default function ApiManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiKey, setApiKey] = useState("mock_api_key_xxxxxxxxxxxxxxxxxxxx"); // Example API Key
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredEndpoints = mockApiEndpoints.filter(endpoint => 
    endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({ title: "API密钥已复制", description: "API密钥已复制到剪贴板。" });
  };

  const handleRegenerateApiKey = () => {
    if(window.confirm("确定要重新生成API密钥吗？旧密钥将立即失效。")) {
        const newKey = `mock_api_key_${Date.now().toString(36).slice(-8)}`;
        setApiKey(newKey);
        toast({ title: "API密钥已重新生成", description: "请妥善保存新密钥。" });
    }
  }

  const getStatusBadge = (status: ApiEndpoint['status']) => {
     switch(status) {
        case 'active': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1"/>Active</Badge>;
        case 'deprecated': return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-white"><XCircle className="h-3 w-3 mr-1"/>Deprecated</Badge>;
        case 'beta': return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white"><KeyRound className="h-3 w-3 mr-1"/>Beta</Badge>;
        case 'disabled': return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1"/>Disabled</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  };

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>API管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载API数据...</p></CardContent></Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Network className="h-6 w-6 text-primary" />
            API接口管理
          </CardTitle>
          <CardDescription>
            管理系统对外提供的API接口、访问密钥、权限设置和调用文档。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">API密钥管理</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Input value={apiKey} readOnly className="flex-grow font-mono text-xs" />
                <Button variant="outline" onClick={handleCopyApiKey} className="w-full sm:w-auto">
                    <Copy className="mr-2 h-4 w-4"/> 复制密钥
                </Button>
                <Button variant="destructive" onClick={handleRegenerateApiKey} className="w-full sm:w-auto">
                    <RotateCcw className="mr-2 h-4 w-4"/> 重新生成密钥
                </Button>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">请妥善保管您的API密钥，不要在客户端代码中暴露。重新生成将使旧密钥立即失效。</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg">API端点列表</CardTitle>
                <CardDescription className="text-sm">查看和管理系统提供的API接口。</CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="搜索API名称或路径..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => toast({title: "提示", description: "新增API端点功能开发中。"})} className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> 新增端点</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px] overflow-y-auto">
                <div className="border rounded-md">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>名称</TableHead>
                        <TableHead>路径</TableHead>
                        <TableHead>方法</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>限流</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEndpoints.map((endpoint) => (
                        <TableRow key={endpoint.id}>
                            <TableCell className="font-medium">{endpoint.name}</TableCell>
                            <TableCell className="font-mono text-xs">{endpoint.path}</TableCell>
                            <TableCell>
                            <Badge variant={
                                endpoint.method === 'GET' ? 'default' : 
                                endpoint.method === 'POST' ? 'secondary' :
                                endpoint.method === 'PUT' ? 'outline' :
                                'destructive'
                            } className="uppercase">{endpoint.method}</Badge>
                            </TableCell>
                            <TableCell>
                            {getStatusBadge(endpoint.status)}
                            </TableCell>
                            <TableCell>{endpoint.rateLimit || '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({title: "提示", description: `编辑端点 ${endpoint.name} 功能开发中`})}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    {filteredEndpoints.length === 0 && (
                        <TableCaption>未找到匹配的API端点。</TableCaption>
                    )}
                    </Table>
                </div>
              </ScrollArea>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">API端点编辑、权限配置等功能正在建设中。</p>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

