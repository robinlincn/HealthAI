
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Network, PlusCircle, KeyRound, Edit, Trash2, MoreHorizontal, Search, Copy, CheckCircle, XCircle } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'deprecated' | 'beta';
  rateLimit?: string;
  description?: string;
  requiredPermissions?: string[];
}

const mockApiEndpoints: ApiEndpoint[] = [
  { id: 'api-001', name: '获取企业列表', path: '/v1/enterprises', method: 'GET', status: 'active', rateLimit: '100/min', description: '查询所有企业账户信息。', requiredPermissions: ['read:enterprises'] },
  { id: 'api-002', name: '创建新企业', path: '/v1/enterprises', method: 'POST', status: 'active', rateLimit: '10/min', description: '注册新的企业账户。', requiredPermissions: ['create:enterprises'] },
  { id: 'api-003', name: '查询病人数据', path: '/v1/patients/{patientId}/health-data', method: 'GET', status: 'beta', description: '获取指定病人的健康数据。', requiredPermissions: ['read:patient_data'] },
  { id: 'api-004', name: '更新服务包配置 (旧版)', path: '/v1/service-packages/{packageId}', method: 'PUT', status: 'deprecated', rateLimit: '50/min', description: '已废弃，请使用 /v2/service-packages。', requiredPermissions: ['update:service_packages'] },
];

export default function ApiManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
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
    navigator.clipboard.writeText("mock_api_key_xxxxxxxxxxxxxxxxxxxx");
    toast({ title: "API密钥已复制", description: "模拟API密钥已复制到剪贴板。" });
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
            API管理
          </CardTitle>
          <CardDescription>
            管理系统对外提供的API接口及其访问权限、安全设置和调用文档。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">API密钥管理</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Input value="mock_api_key_xxxxxxxxxxxxxxxxxxxx (示例)" readOnly className="flex-grow" />
                <Button variant="outline" onClick={handleCopyApiKey} className="w-full sm:w-auto">
                    <Copy className="mr-2 h-4 w-4"/> 复制密钥
                </Button>
                <Button variant="destructive" disabled className="w-full sm:w-auto">
                    <KeyRound className="mr-2 h-4 w-4"/> 重新生成密钥 (开发中)
                </Button>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">请妥善保管您的API密钥，不要在客户端代码中暴露。重新生成将使旧密钥失效。</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg">API端点列表</CardTitle>
                <CardDescription className="text-sm">查看和管理系统提供的API接口。</CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
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
                <Button disabled className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> 新增端点 (开发中)</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-md">
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
                           {endpoint.status === 'active' && <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1"/>Active</Badge>}
                           {endpoint.status === 'deprecated' && <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1"/>Deprecated</Badge>}
                           {endpoint.status === 'beta' && <Badge variant="secondary"><KeyRound className="h-3 w-3 mr-1"/>Beta</Badge>}
                        </TableCell>
                        <TableCell>{endpoint.rateLimit || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
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

