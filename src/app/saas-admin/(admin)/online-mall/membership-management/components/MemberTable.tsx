
'use client';

import type { SaasPatient, SaasMembershipLevel } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, UserCircle, Award, BadgeEuro } from 'lucide-react'; // Using BadgeEuro for points
import { format, parseISO, differenceInYears } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface MemberTableProps {
  members: SaasPatient[];
  levels: SaasMembershipLevel[];
  onEdit: (member: SaasPatient) => void;
}

export function MemberTable({ members, levels, onEdit }: MemberTableProps) {

  const getLevelName = (levelId?: string) => {
    if (!levelId) return '无等级';
    return levels.find(l => l.id === levelId)?.name || '未知等级';
  };
  
  const getAge = (dob?: string) => {
    if (!dob) return 'N/A';
    try {
      return differenceInYears(new Date(), parseISO(dob));
    } catch (e) { return 'N/A'; }
  };

  if (members.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">此企业暂无会员（病人）数据。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>性别</TableHead>
            <TableHead>年龄</TableHead>
            <TableHead>会员等级</TableHead>
            <TableHead>当前积分</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center">
                  <UserCircle className="h-4 w-4 mr-1.5 text-muted-foreground"/>
                  {member.name}
                </span>
              </TableCell>
              <TableCell>{member.gender === 'male' ? '男' : member.gender === 'female' ? '女' : '其他'}</TableCell>
              <TableCell>{getAge(member.dob)}</TableCell>
              <TableCell>
                <Badge variant={member.membershipLevelId ? 'default' : 'outline'} className="capitalize">
                  <Award className="h-3.5 w-3.5 mr-1"/>
                  {getLevelName(member.membershipLevelId)}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center">
                 <BadgeEuro className="h-3.5 w-3.5 mr-1 text-yellow-600"/> {member.points ?? 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
                  <Edit className="mr-1 h-3.5 w-3.5" /> 编辑会籍
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {members.length > 5 && (
            <TableCaption>共 {members.length} 位会员。</TableCaption>
        )}
      </Table>
    </div>
  );
}

    