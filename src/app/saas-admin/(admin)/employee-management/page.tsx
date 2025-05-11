
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeTable } from "./components/EmployeeTable";
import { EmployeeDialog } from "./components/EmployeeDialog";
import type { SaasEmployee, SaasEnterprise, SaasDepartment } from '@/lib/types';
import { Users, PlusCircle, Search, Briefcase, Building2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from "@/components/ui/label";

// Mock data - replace with actual data fetching
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三院长', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'13800000001', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四主任', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'13900000002', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
];

const mockDepartments: SaasDepartment[] = [
  { id: 'dept-001', enterpriseId: 'ent-001', name: '内科', creationDate: new Date().toISOString(), headEmployeeId: 'emp-001a', parentDepartmentId: null, description: '负责内科疾病诊疗' },
  { id: 'dept-002', enterpriseId: 'ent-001', name: '外科', creationDate: new Date().toISOString(), headEmployeeId: 'emp-002a', parentDepartmentId: null, description: '负责外科手术及治疗' },
  { id: 'dept-003', enterpriseId: 'ent-002', name: '体检科', creationDate: new Date().toISOString(), description: '负责健康体检服务' },
];

const mockInitialEmployees: SaasEmployee[] = [
    { id: 'emp-001a', enterpriseId: 'ent-001', departmentId: 'dept-001', name: '王明医生', email: 'wm@hospitala.com', status: 'active', joinDate: new Date(2023,5,10).toISOString(), employeeNumber: 'DOC001', phone: '13312345678', roleTitle: '主任医师' },
    { id: 'emp-002a', enterpriseId: 'ent-001', departmentId: 'dept-002', name: '刘芳护士', email: 'lf@hospitala.com', status: 'active', joinDate: new Date(2022,8,1).toISOString(), employeeNumber: 'NUR005', phone: '13387654321', roleTitle: '护士长' },
    { id: 'emp-001b', enterpriseId: 'ent-002', departmentId: 'dept-003', name: '孙琳技师', email: 'sl@healthb.com', status: 'invited', joinDate: new Date(2024,4,1).toISOString(), roleTitle: '体检技师' },
];


export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<SaasEmployee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<SaasEmployee | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (mockEnterprises.length > 0 && !selectedEnterpriseId) {
        setSelectedEnterpriseId(mockEnterprises[0].id);
    }
    setEmployees(mockInitialEmployees);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddEmployee = () => {
    if (!selectedEnterpriseId) {
      toast({ title: '请先选择一个企业', variant: 'destructive', description: '无法在未选择企业的情况下添加员工。' });
      return;
    }
    setEditingEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: SaasEmployee) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('确定要删除此员工吗？此操作不可撤销。')) {
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
      toast({ title: '删除成功', description: '员工已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasEmployee) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => (e.id === editingEmployee.id ? { ...e, ...data } : e)));
      toast({ title: '更新成功', description: `员工 "${data.name}" 信息已更新。`});
    } else {
      const newEmployee = { 
        ...data, 
        id: data.id || `emp-${Date.now().toString()}`,
        creationDate: new Date().toISOString(), // Ensure creationDate exists
        enterpriseId: selectedEnterpriseId! // Already checked in handleAddEmployee
      };
      setEmployees(prev => [newEmployee, ...prev]);
      toast({ title: '创建成功', description: `新员工 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingEmployee(null);
  };
  
  const departmentsForSelectedEnterprise = useMemo(() => {
      if(!selectedEnterpriseId) return [];
      return mockDepartments.filter(d => d.enterpriseId === selectedEnterpriseId);
  }, [selectedEnterpriseId]);

  const employeesForSelectedEnterprise = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return employees.filter(emp => 
      emp.enterpriseId === selectedEnterpriseId &&
      (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [employees, selectedEnterpriseId, searchTerm]);


  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>员工管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载员工数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            员工管理 (医院医生/员工管理)
          </CardTitle>
          <CardDescription>
            管理企业/医院账户下的员工（如医生、护士、客服等）信息和系统访问权限。请先选择一个企业。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto sm:min-w-[250px]">
              <Label htmlFor="enterpriseSelectEmp" className="sr-only">选择企业</Label>
              <Select
                value={selectedEnterpriseId || ""}
                onValueChange={(value) => setSelectedEnterpriseId(value)}
              >
                <SelectTrigger id="enterpriseSelectEmp" className="w-full">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                  <SelectValue placeholder="选择一个企业以管理其员工" />
                </SelectTrigger>
                <SelectContent>
                  {mockEnterprises.map(enterprise => (
                    <SelectItem key={enterprise.id} value={enterprise.id}>
                      {enterprise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索员工姓名或邮箱..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!selectedEnterpriseId}
                />
            </div>
            <Button onClick={handleAddEmployee} className="w-full sm:w-auto" disabled={!selectedEnterpriseId}>
                <PlusCircle className="mr-2 h-4 w-4" /> 新增员工
            </Button>
          </div>
          
          {selectedEnterpriseId ? (
            <EmployeeTable 
              employees={employeesForSelectedEnterprise} 
              departments={departmentsForSelectedEnterprise}
              onEdit={handleEditEmployee} 
              onDelete={handleDeleteEmployee}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">
              请先从上方选择一个企业以查看或管理其员工。
            </div>
          )}

        </CardContent>
      </Card>

      {selectedEnterpriseId && isDialogOpen && (
        <EmployeeDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingEmployee(null);
          }}
          onSubmit={handleDialogSubmit}
          employee={editingEmployee}
          enterpriseId={selectedEnterpriseId}
          departments={departmentsForSelectedEnterprise}
        />
      )}
    </div>
  );
}

