
'use client';

import type { SaasAiWorkflowApiConfig } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface WorkflowApiConfigTableProps {
  configs: SaasAiWorkflowApiConfig[];
  onEdit: (config: SaasAiWorkflowApiConfig) => void;
  onDelete: (configId: string) => void;
}

export function WorkflowApiConfigTable({ configs, onEdit, onDelete }: WorkflowApiConfigTableProps) {

  const getStatusBadge = (status?: SaasAiWorkflowApiConfig['status']) => {
    if (status === 'active') {
      return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3.5 w-3.5 mr-1"/>已激活</Badge>;
    }
    return <Badge variant="secondary"><XCircle className="h-3.5 w-3.5 mr-1"/>未激活</Badge>;
  };

  if (configs.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无AI工作流API配置。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>API端点</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id}>
              <TableCell className="font-medium">{config.name}</TableCell>
              <TableCell>
                <Badge variant={config.type === 'Dify' ? 'default' : (config.type === 'Coze' ? 'secondary' : 'outline')}>
                  {config.type}
                </Badge>
              </TableCell>
              <TableCell className="text-xs font-mono max-w-xs truncate" title={config.apiEndpoint}>
                <a href={config.apiEndpoint} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {config.apiEndpoint} <ExternalLink className="inline h-3 w-3 ml-1" />
                </a>
              </TableCell>
              <TableCell>{getStatusBadge(config.status)}</TableCell>
              <TableCell>{format(parseISO(config.creationDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(config)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(config.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {configs.length > 3 && (
            <TableCaption>共 {configs.length} 条AI工作流API配置。</TableCaption>
        )}
      </Table>
    </div>
  );
}

    