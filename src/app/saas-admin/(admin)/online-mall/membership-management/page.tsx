
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MembershipLevelTable } from "./components/MembershipLevelTable";
import { MembershipLevelDialog } from "./components/MembershipLevelDialog";
import { MemberTable } from "./components/MemberTable";
import { MemberEditDialog } from "./components/MemberEditDialog";
import type { SaasMembershipLevel, SaasEnterprise, SaasPatient } from '@/lib/types';
import { Contact, PlusCircle, Search, Briefcase, Filter, Award, Users } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label'; // Added Label import

// Mock data
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

const mockInitialLevels: SaasMembershipLevel[] = [
  { id: 'lvl-001', enterpriseId: 'ent-001', name: '黄金会员', minPoints: 1000, discountPercentage: 0.1, description: '享受九折优惠', creationDate: new Date().toISOString(), permissions: ['priority_support'] },
  { id: 'lvl-002', enterpriseId: 'ent-001', name: '白金会员', minPoints: 5000, discountPercentage: 0.15, creationDate: new Date().toISOString(), permissions: ['priority_support', 'exclusive_products']},
  { id: 'lvl-003', enterpriseId: 'ent-002', name: '体验会员', minPoints: 0, discountPercentage: 0.05, creationDate: new Date().toISOString() },
];

const mockInitialPatients: SaasPatient[] = [
  { id: 'pat-saas-001', enterpriseId: 'ent-001', name: '刘备', gender: 'male', dob: '1961-07-23', membershipLevelId: 'lvl-001', points: 1250 },
  { id: 'pat-saas-002', enterpriseId: 'ent-001', name: '关羽', gender: 'male', dob: '1960-08-12', membershipLevelId: 'lvl-002', points: 5500 },
  { id: 'pat-saas-003', enterpriseId: 'ent-002', name: '孙尚香', gender: 'female', dob: '1987-03-15', membershipLevelId: 'lvl-003', points: 150 },
  { id: 'pat-saas-004', enterpriseId: 'ent-001', name: '张飞', gender: 'male', dob: '1967-01-20', points: 50 },
];


export default function MembershipManagementPage() {
  const [levels, setLevels] = useState<SaasMembershipLevel[]>([]);
  const [members, setMembers] = useState<SaasPatient[]>([]);
  
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<SaasMembershipLevel | null>(null);
  
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<SaasPatient | null>(null);

  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [levelSearchTerm, setLevelSearchTerm] = useState('');

  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching data if needed, or use mocks directly
    if (mockEnterprises.length > 0 && !selectedEnterpriseId) {
      // setSelectedEnterpriseId(mockEnterprises[0].id); // Optionally pre-select first enterprise
    }
    setLevels(mockInitialLevels);
    setMembers(mockInitialPatients);
  }, [selectedEnterpriseId]); // Removed selectedEnterpriseId from dependency array to avoid re-fetching on every change

  // Filter levels and members based on selectedEnterpriseId
  const filteredLevels = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return levels.filter(level => 
        level.enterpriseId === selectedEnterpriseId &&
        level.name.toLowerCase().includes(levelSearchTerm.toLowerCase())
    );
  }, [levels, selectedEnterpriseId, levelSearchTerm]);

  const filteredMembers = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return members.filter(member => 
        member.enterpriseId === selectedEnterpriseId &&
        member.name.toLowerCase().includes(memberSearchTerm.toLowerCase())
    );
  }, [members, selectedEnterpriseId, memberSearchTerm]);

  // Membership Level CRUD
  const handleAddLevel = () => {
    if (!selectedEnterpriseId) {
        toast({ title: "请先选择企业", description: "无法为未选定的企业添加会员等级。", variant: "destructive"});
        return;
    }
    setEditingLevel(null);
    setIsLevelDialogOpen(true);
  };
  const handleEditLevel = (level: SaasMembershipLevel) => { setEditingLevel(level); setIsLevelDialogOpen(true); };
  const handleDeleteLevel = (levelId: string) => {
    if (window.confirm("确定删除此会员等级吗？")) {
      setLevels(prev => prev.filter(l => l.id !== levelId));
      // Also update members who had this level (set to undefined or a default)
      setMembers(prevMembers => prevMembers.map(m => m.membershipLevelId === levelId ? {...m, membershipLevelId: undefined} : m));
      toast({ title: "删除成功", description: "会员等级已删除。" });
    }
  };
  const handleLevelDialogSubmit = (data: any) => { // data type is Pick<SaasMembershipLevel, ...> & { id?: string, enterpriseId: string }
    const enterpriseIdForLevel = selectedEnterpriseId; // This should be set when opening dialog for new
    if (editingLevel) {
      setLevels(prev => prev.map(l => (l.id === editingLevel.id ? { ...editingLevel, ...data, enterpriseId: l.enterpriseId } : l)));
      toast({ title: '更新成功', description: `会员等级 "${data.name}" 已更新。`});
    } else {
      if (!enterpriseIdForLevel) {
          toast({title: "错误", description: "未指定企业，无法创建等级。", variant: "destructive"});
          return;
      }
      const newLevel = { ...data, id: `lvl-${Date.now()}`, enterpriseId: enterpriseIdForLevel, creationDate: new Date().toISOString() };
      setLevels(prev => [newLevel, ...prev]);
      toast({ title: '创建成功', description: `新会员等级 "${data.name}" 已添加。`});
    }
    setIsLevelDialogOpen(false);
  };

  // Member Edit (Level & Points)
  const handleEditMember = (member: SaasPatient) => { setEditingMember(member); setIsMemberDialogOpen(true); };
  const handleMemberDialogSubmit = (memberId: string, data: Partial<Pick<SaasPatient, 'membershipLevelId' | 'points'>>) => {
    setMembers(prev => prev.map(m => (m.id === memberId ? { ...m, ...data } : m)));
    toast({ title: '更新成功', description: `会员 ${memberId} 的会籍信息已更新。`});
    setIsMemberDialogOpen(false);
  };

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载会员管理数据...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Contact className="h-6 w-6 text-primary" />
            会员管理
          </CardTitle>
          <CardDescription>
            管理商城会员的等级体系、积分和会籍信息。请先选择一个企业。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="enterpriseSelectForMembership">选择企业/医院</Label>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
              <SelectTrigger id="enterpriseSelectForMembership" className="w-full md:w-[300px]">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="选择一个企业/医院" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- 请选择 --</SelectItem>
                {mockEnterprises.map(ent => (
                  <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedEnterpriseId && (
        <>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle className="text-lg flex items-center"><Award className="mr-2 h-5 w-5"/>会员等级管理</CardTitle>
                    <CardDescription>为“{mockEnterprises.find(e=>e.id===selectedEnterpriseId)?.name || ''}”管理会员等级。</CardDescription>
                </div>
                <Button onClick={handleAddLevel}><PlusCircle className="mr-2 h-4 w-4"/> 添加等级</Button>
            </CardHeader>
            <CardContent>
                <Input 
                    placeholder="搜索等级名称..." 
                    value={levelSearchTerm} 
                    onChange={(e) => setLevelSearchTerm(e.target.value)} 
                    className="mb-3 max-w-xs h-9"
                />
                <MembershipLevelTable levels={filteredLevels} onEdit={handleEditLevel} onDelete={handleDeleteLevel} />
            </CardContent>
          </Card>

          <Separator className="my-8"/>

          <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><Users className="mr-2 h-5 w-5"/>会员列表与管理</CardTitle>
                <CardDescription>查看和编辑“{mockEnterprises.find(e=>e.id===selectedEnterpriseId)?.name || ''}”的会员会籍信息。</CardDescription>
            </CardHeader>
            <CardContent>
                <Input 
                    placeholder="搜索会员名称..." 
                    value={memberSearchTerm} 
                    onChange={(e) => setMemberSearchTerm(e.target.value)} 
                    className="mb-3 max-w-xs h-9"
                />
                <MemberTable members={filteredMembers} levels={filteredLevels} onEdit={handleEditMember} />
            </CardContent>
          </Card>
        </>
      )}
      {!selectedEnterpriseId && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">请先选择一个企业以查看和管理会员信息。</CardContent></Card>
      )}

      {selectedEnterpriseId && isClient && (
        <MembershipLevelDialog
          isOpen={isLevelDialogOpen}
          onClose={() => setIsLevelDialogOpen(false)}
          onSubmit={handleLevelDialogSubmit}
          level={editingLevel}
          enterpriseId={selectedEnterpriseId}
        />
      )}
      {selectedEnterpriseId && isClient && (
        <MemberEditDialog
          isOpen={isMemberDialogOpen}
          onClose={() => setIsMemberDialogOpen(false)}
          onSubmit={handleMemberDialogSubmit}
          member={editingMember}
          membershipLevels={filteredLevels} // Pass levels of the selected enterprise
        />
      )}
    </div>
  );
}

    