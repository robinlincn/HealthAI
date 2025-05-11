
'use client';

import type { SaasSopService } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, ExternalLink, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface SopServiceTableProps {
  services: SaasSopService[];
  onEdit: (service: SaasSopService) => void;
  onDelete: (serviceId: string) => void;
  onToggleStatus: (serviceId: string) => void;
  onViewLogs?: (serviceId: string) => void; // Placeholder for future log viewing
}

export function SopServiceTable({ services, onEdit, onDelete, onToggleStatus, onViewLogs }: SopServiceTableProps) {

  const getStatusBadge = (status: SaasSopService['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3.5 w-3.5 mr-1"/>已激活</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><XCircle className="h-3.5 w-3.5 mr-1"/>未激活</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>错误</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (services.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无SOP服务配置。请添加新服务。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>服务名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>API端点</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                <Badge variant={service.type === 'Coze' ? 'default' : (service.type === 'Dify' ? 'secondary' : 'outline')}>
                  {service.type}
                </Badge>
              </TableCell>
              <TableCell className="text-xs font-mono max-w-xs truncate" title={service.apiEndpoint}>
                <a href={service.apiEndpoint} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {service.apiEndpoint} <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
              </TableCell>
              <TableCell>{getStatusBadge(service.status)}</TableCell>
              <TableCell>{format(parseISO(service.creationDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(service)}>
                      <Edit className="mr-2 h-4 w-4" />编辑配置
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(service.id)}>
                      {service.status === 'active' ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      {service.status === 'active' ? '停用' : '启用'}
                    </DropdownMenuItem>
                    {onViewLogs && (
                        <DropdownMenuItem onClick={() => onViewLogs(service.id)} disabled> {/* Disabled for now */}
                            <BarChart2 className="mr-2 h-4 w-4" />查看日志/统计
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(service.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除服务
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {services.length > 5 && (
            <TableCaption>共 {services.length} 条SOP服务记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
