
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DepartmentTable } from "./components/DepartmentTable";
import { DepartmentDialog } from "./components/DepartmentDialog";
import type { SaasDepartment, SaasEnterprise, SaasEmployee } from '@/lib/types';
import { Building2, PlusCircle, Search, Briefcase } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from "@/components/ui/label"; // Added import for Label

// Mock data - ideally fetched or from context
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三院长', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'13800000001', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四主任', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'13900000002', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
];

const mockInitialDepartments: SaasDepartment[] = [
  { id: 'dept-001', enterpriseId: 'ent-001', name: '内科', creationDate: new Date().toISOString(), headEmployeeId: 'emp-001a', parentDepartmentId: null, description: '负责内科疾病诊疗' },
  { id: 'dept-002', enterpriseId: 'ent-001', name: '外科', creationDate: new Date().toISOString(), headEmployeeId: 'emp-002a', parentDepartmentId: null, description: '负责外科手术及治疗' },
  { id: 'dept-003', enterpriseId: 'ent-001', name: '心血管内科', creationDate: new Date().toISOString(), headEmployeeId: 'emp-003a', parentDepartmentId: 'dept-001', description: '内科下属心血管专科' },
  { id: 'dept-004', enterpriseId: 'ent-002', name: '体检科', creationDate: new Date().toISOString(), headEmployeeId: 'emp-001b', description: '负责健康体检服务' },
];

const mockInitialEmployees: SaasEmployee[] = [
    { id: 'emp-001a', enterpriseId: 'ent-001', departmentId: 'dept-001', name: '王明医生', email: 'wm@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-002a', enterpriseId: 'ent-001', departmentId: 'dept-002', name: '刘芳医生', email: 'lf@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-003a', enterpriseId: 'ent-001', departmentId: 'dept-003', name: '赵强主任', email: 'zq@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-001b', enterpriseId: 'ent-002', departmentId: 'dept-004', name: '孙琳护士', email: 'sl@healthb.com', status: 'active', joinDate: new Date().toISOString() },
];

export default function DepartmentManagementPage() {
  const [departments, setDepartments] = useState<SaasDepartment[]>([]);
  const [employees, setEmployees] = useState<SaasEmployee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<SaasDepartment | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    // Load initial data only on client-side to avoid hydration issues with dates
    // In a real app, fetch enterprises first, then allow selection, then fetch departments.
    if (mockEnterprises.length > 0 && !selectedEnterpriseId) {
        setSelectedEnterpriseId(mockEnterprises[0].id);
    }
    setDepartments(mockInitialDepartments);
    setEmployees(mockInitialEmployees);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddDepartment = () => {
    if (!selectedEnterpriseId) {
      toast({ title: '请先选择一个企业', variant: 'destructive', description: '无法在未选择企业的情况下添加部门。' });
      return;
    }
    setEditingDepartment(null);
    setIsDialogOpen(true);
  };

  const handleEditDepartment = (department: SaasDepartment) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    // Check if department has sub-departments or assigned employees before deleting
    const hasSubDepartments = departments.some(d => d.parentDepartmentId === departmentId);
    const hasEmployees = employees.some(e => e.departmentId === departmentId);

    let confirmMessage = '确定要删除此部门吗？';
    if (hasSubDepartments) confirmMessage += '\n注意：此部门包含下级部门，删除后下级部门的上级关系将丢失。';
    if (hasEmployees) confirmMessage += '\n注意：此部门仍有员工分配，删除后员工的部门信息将丢失。';
    confirmMessage += '\n此操作不可撤销。';

    if (window.confirm(confirmMessage)) {
      setDepartments(prev => prev.filter(d => d.id !== departmentId));
      // Also update employees who were in this department (optional, based on requirements)
      setEmployees(prev => prev.map(e => e.departmentId === departmentId ? {...e, departmentId: undefined} : e));
      toast({ title: '删除成功', description: '部门已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasDepartment) => {
    if (editingDepartment) {
      setDepartments(prev => prev.map(d => (d.id === editingDepartment.id ? { ...d, ...data } : d)));
      toast({ title: '更新成功', description: `部门 "${data.name}" 信息已更新。`});
    } else {
      const newDepartment = { 
        ...data, 
        id: data.id || `dept-${Date.now().toString()}`, // Ensure new ID is unique
        creationDate: data.creationDate || new Date().toISOString(),
        enterpriseId: selectedEnterpriseId! 
      };
      setDepartments(prev => [newDepartment, ...prev]);
      toast({ title: '创建成功', description: `新部门 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingDepartment(null);
  };

  const departmentsForSelectedEnterprise = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return departments.filter(dept => 
      dept.enterpriseId === selectedEnterpriseId &&
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, selectedEnterpriseId, searchTerm]);
  
  const employeesForSelectedEnterprise = useMemo(() => {
    if(!selectedEnterpriseId) return [];
    return employees.filter(emp => emp.enterpriseId === selectedEnterpriseId);
  }, [employees, selectedEnterpriseId]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>部门管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载部门数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6 text-primary" />
            部门管理 (医院科室管理)
          </CardTitle>
          <CardDescription>
            针对每个企业/医院账户，管理其内部的部门或科室结构。请先从下方选择一个企业。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto sm:min-w-[250px]">
              <Label htmlFor="enterpriseSelect" className="sr-only">选择企业</Label>
              <Select
                value={selectedEnterpriseId || ""}
                onValueChange={(value) => setSelectedEnterpriseId(value)}
              >
                <SelectTrigger id="enterpriseSelect" className="w-full">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                  <SelectValue placeholder="选择一个企业以管理其部门" />
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
                    placeholder="搜索部门名称..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!selectedEnterpriseId}
                />
            </div>
            <Button onClick={handleAddDepartment} className="w-full sm:w-auto" disabled={!selectedEnterpriseId}>
                <PlusCircle className="mr-2 h-4 w-4" /> 新增部门
            </Button>
          </div>
          
          {selectedEnterpriseId ? (
            <DepartmentTable 
              departments={departmentsForSelectedEnterprise} 
              employees={employeesForSelectedEnterprise}
              onEdit={handleEditDepartment} 
              onDelete={handleDeleteDepartment}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">
              请先从上方选择一个企业以查看或管理其部门。
            </div>
          )}

        </CardContent>
      </Card>

      {selectedEnterpriseId && isDialogOpen && (
        <DepartmentDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingDepartment(null);
          }}
          onSubmit={handleDialogSubmit}
          department={editingDepartment}
          enterpriseId={selectedEnterpriseId}
          existingDepartments={departments.filter(d => d.enterpriseId === selectedEnterpriseId)} // Pass all departments of selected enterprise
          enterpriseEmployees={employeesForSelectedEnterprise}
        />
      )}
    </div>
  );
}

