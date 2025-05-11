'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerTable } from "./components/CustomerTable";
import type { SaasPatient, SaasEnterprise } from '@/lib/types';
import { Users, Search, Filter, Briefcase } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Mock data - Reusing enterprises for context
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三院长', creationDate: new Date(2023,0,15).toISOString(), contactEmail:'a@a.com', contactPhone:'13800000001', status: 'active', assignedResources: {maxUsers:50,maxStorageGB:100,maxPatients:5000}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四主任', creationDate: new Date(2024,4,1).toISOString(), contactEmail:'b@b.com', contactPhone:'13900000002', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:20,maxPatients:500}},
  { id: 'ent-003', name: '社区诊所C', contactPerson: '王五医生', creationDate: new Date(2023, 8, 10).toISOString(), contactEmail:'c@c.com', contactPhone:'13700000003', status: 'inactive', assignedResources: {maxUsers:5,maxStorageGB:10,maxPatients:200}},
];

const mockInitialPatients: SaasPatient[] = [
  { id: 'pat-saas-001', enterpriseId: 'ent-001', name: '刘备', gender: 'male', dob: '1961-07-23', primaryDisease: '高血压', lastInteractionDate: '2024-05-10' },
  { id: 'pat-saas-002', enterpriseId: 'ent-001', name: '关羽', gender: 'male', dob: '1960-08-12', primaryDisease: '2型糖尿病', lastInteractionDate: '2024-05-15' },
  { id: 'pat-saas-003', enterpriseId: 'ent-002', name: '孙尚香', gender: 'female', dob: '1987-03-15', primaryDisease: '哮喘', lastInteractionDate: '2024-05-18' },
  { id: 'pat-saas-004', enterpriseId: 'ent-001', name: '张飞', gender: 'male', dob: '1967-01-20', primaryDisease: '高血脂', lastInteractionDate: '2024-05-01' },
  { id: 'pat-saas-005', enterpriseId: 'ent-002', name: '黄月英', gender: 'female', dob: '1975-11-05', primaryDisease: '骨质疏松', lastInteractionDate: '2024-04-20' },
  { id: 'pat-saas-006', enterpriseId: 'ent-003', name: '马超', gender: 'male', dob: '1976-06-01', primaryDisease: '痛风', lastInteractionDate: '2024-05-12' },
];

export default function CustomerCenterPage() {
  const [patients, setPatients] = useState<SaasPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterprise, setFilterEnterprise] = useState<string>("all");
  const [filterDisease, setFilterDisease] = useState<string>("all");
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setPatients(mockInitialPatients);
  }, []);

  const diseaseTypes = useMemo(() => {
    const allDiseases = new Set(patients.map(p => p.primaryDisease).filter(Boolean) as string[]);
    return Array.from(allDiseases);
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const enterpriseMatch = filterEnterprise === "all" || patient.enterpriseId === filterEnterprise;
      const diseaseMatch = filterDisease === "all" || patient.primaryDisease === filterDisease;
      const searchMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (patient.id && patient.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (patient.contactPhone && patient.contactPhone.includes(searchTerm));
      return enterpriseMatch && diseaseMatch && searchMatch;
    });
  }, [patients, searchTerm, filterEnterprise, filterDisease]);
  
  const handleViewDetails = (patient: SaasPatient) => {
      const enterpriseName = mockEnterprises.find(e => e.id === patient.enterpriseId)?.name || '未知企业';
      toast({
          title: `查看病人详情 (模拟)`,
          description: `病人: ${patient.name}\nID: ${patient.id}\n所属企业: ${enterpriseName}\n主要诊断: ${patient.primaryDisease || '未记录'}`,
          duration: 5000,
      });
  };

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>客户中心</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载客户数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            客户中心 (医院病人管理)
          </CardTitle>
          <CardDescription>
            查看和管理由各企业/医院服务的最终客户（病人）信息汇总。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <Label htmlFor="patientSearch" className="sr-only">搜索病人</Label>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="patientSearch"
                    type="search"
                    placeholder="搜索病人姓名、ID、电话..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
              <Select value={filterEnterprise} onValueChange={setFilterEnterprise}>
                  <SelectTrigger className="w-full md:w-[200px]">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                      <SelectValue placeholder="筛选企业/医院" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有企业</SelectItem>
                      {mockEnterprises.map(ent => (
                          <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Select value={filterDisease} onValueChange={setFilterDisease}>
                  <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground"/>
                      <SelectValue placeholder="筛选主要诊断" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有诊断</SelectItem>
                      {diseaseTypes.map(disease => (
                          <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
          </div>
          
          <CustomerTable 
            patients={filteredPatients} 
            enterprises={mockEnterprises}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
}
