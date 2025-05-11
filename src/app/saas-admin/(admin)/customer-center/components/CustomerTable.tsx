'use client';

import type { SaasPatient, SaasEnterprise } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, ShieldAlert, UserCircle, Building } from 'lucide-react';
import { format, differenceInYears, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface CustomerTableProps {
  patients: SaasPatient[];
  enterprises: SaasEnterprise[];
  onViewDetails: (patient: SaasPatient) => void;
}

export function CustomerTable({ patients, enterprises, onViewDetails }: CustomerTableProps) {

  const getEnterpriseName = (enterpriseId: string) => {
    const enterprise = enterprises.find(e => e.id === enterpriseId);
    return enterprise ? enterprise.name : '未知企业';
  };

  const getAge = (dob?: string) => {
    if (!dob) return 'N/A';
    try {
      return differenceInYears(new Date(), parseISO(dob));
    } catch (e) {
      return 'N/A';
    }
  };

  const getGenderText = (gender: SaasPatient['gender']) => {
    const map = { male: '男', female: '女', other: '其他' };
    return map[gender] || '未知';
  };


  if (patients.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无客户（病人）数据。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>病人姓名</TableHead>
            <TableHead>所属企业</TableHead>
            <TableHead>性别</TableHead>
            <TableHead>年龄</TableHead>
            <TableHead>主要诊断</TableHead>
            <TableHead>最近互动</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center">
                  <UserCircle className="h-4 w-4 mr-1.5 text-muted-foreground"/>
                  {patient.name}
                </span>
              </TableCell>
              <TableCell>
                 <span className="inline-flex items-center">
                  <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground"/>
                  {getEnterpriseName(patient.enterpriseId)}
                 </span>
              </TableCell>
              <TableCell>{getGenderText(patient.gender)}</TableCell>
              <TableCell>{getAge(patient.dob)}</TableCell>
              <TableCell>
                {patient.primaryDisease ? 
                <Badge variant="outline">{patient.primaryDisease}</Badge> 
                : '-'}
              </TableCell>
              <TableCell>{patient.lastInteractionDate ? format(parseISO(patient.lastInteractionDate), 'yyyy-MM-dd') : '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(patient)}>
                  <Eye className="mr-1 h-4 w-4" />查看
                </Button>
                {/* Add other actions if needed, e.g., a DropdownMenu */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {patients.length > 5 && (
            <TableCaption>共 {patients.length} 条客户（病人）记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
