
'use client';

import type { SaasMembershipLevel } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Award, Percent, ListChecks } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MembershipLevelTableProps {
  levels: SaasMembershipLevel[];
  onEdit: (level: SaasMembershipLevel) => void;
  onDelete: (levelId: string) => void;
}

export function MembershipLevelTable({ levels, onEdit, onDelete }: MembershipLevelTableProps) {

  if (levels.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">此企业暂无会员等级。请添加新等级。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>等级名称</TableHead>
            <TableHead>所需积分</TableHead>
            <TableHead>折扣</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level) => (
            <TableRow key={level.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center">
                  <Award className="h-4 w-4 mr-1.5 text-primary"/>
                  {level.name}
                </span>
              </TableCell>
              <TableCell>{level.minPoints ?? '-'}</TableCell>
              <TableCell>
                {level.discountPercentage !== undefined ? `${(level.discountPercentage * 100).toFixed(0)}%` : '-'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-sm truncate" title={level.description}>
                {level.description || '-'}
              </TableCell>
              <TableCell>{format(parseISO(level.creationDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(level)}>
                      <Edit className="mr-2 h-4 w-4" />编辑等级
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(level.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除等级
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {levels.length > 3 && (
            <TableCaption>共 {levels.length} 个会员等级。</TableCaption>
        )}
      </Table>
    </div>
  );
}

    