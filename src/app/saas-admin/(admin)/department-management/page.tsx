
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

// Mock data - ideally fetched or from context
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三院长', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'123', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四主任', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'123', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
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
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string | null>(mockEnterprises[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setDepartments(mockInitialDepartments);
    setEmployees(mockInitialEmployees);
  }, []);

  const handleAddDepartment = () => {
    if (!selectedEnterpriseId) {
      toast({ title: '请先选择一个企业', variant: 'destructive' });
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
    if (window.confirm('确定要删除此部门吗？此操作不可撤销。')) {
      setDepartments(prev => prev.filter(d => d.id !== departmentId));
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
        id: data.id || Date.now().toString(), 
        creationDate: data.creationDate || new Date().toISOString(),
        enterpriseId: selectedEnterpriseId! // Should be set if add is enabled
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
        <Card><CardHeader><CardTitle>部门管理</CardTitle></CardHeader><CardContent><p>加载中...</p></CardContent></Card>
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
            针对每个企业/医院账户，管理其内部的部门或科室结构。
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
              请先选择一个企业以查看或管理其部门。
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
          existingDepartments={departmentsForSelectedEnterprise}
          enterpriseEmployees={employeesForSelectedEnterprise}
        />
      )}
    </div>
  );
}
