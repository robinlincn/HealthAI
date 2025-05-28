
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import type { SaasProductDistributionAssignment, SaasEnterprise, SaasProduct, SaasEmployee } from '@/lib/types';
import { Share2, Briefcase, PackageSearch, Users, Percent, PlusCircle, Trash2, SearchIcon } from "lucide-react";
import { format, parseISO, subDays } from 'date-fns';
import { Badge } from "@/components/ui/badge"; // Added Badge import

// Mock data (reuse or adapt from other parts of the SAAS admin)
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

const mockProducts: SaasProduct[] = [
  { id: 'prod-001', enterpriseId: 'ent-001', name: '智能血糖仪套装', category: '医疗器械', price: 299.00, stock: 150, status: 'active', creationDate: new Date().toISOString(), images: ['https://placehold.co/60x60.png?text=P1']},
  { id: 'prod-002', enterpriseId: 'ent-001', name: '控糖膳食营养包 (7日)', category: '膳食包', price: 199.00, stock: 80, status: 'active', creationDate: new Date().toISOString(), images: ['https://placehold.co/60x60.png?text=P2']},
  { id: 'prod-003', enterpriseId: 'ent-002', name: '养心安神药膳包', category: '药膳包', price: 99.00, stock: 200, status: 'draft', creationDate: new Date().toISOString(), images: ['https://placehold.co/60x60.png?text=P3']},
];

const mockEmployees: SaasEmployee[] = [
  { id: 'emp-saas-001', enterpriseId: 'ent-001', name: '王医生 (医院A)', email: 'wang@hospitala.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
  { id: 'emp-saas-002', enterpriseId: 'ent-001', name: '李护士 (医院A)', email: 'li@hospitala.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
  { id: 'emp-saas-003', enterpriseId: 'ent-002', name: '赵顾问 (中心B)', email: 'zhao@healthb.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
];

const mockInitialAssignments: SaasProductDistributionAssignment[] = [
    {id: 'dist-001', enterpriseId: 'ent-001', productId: 'prod-001', employeeId: 'emp-saas-001', commissionRate: 0.10, status: 'active', assignmentDate: subDays(new Date(), 5).toISOString()},
    {id: 'dist-002', enterpriseId: 'ent-001', productId: 'prod-002', employeeId: 'emp-saas-001', commissionRate: 0.12, status: 'active', assignmentDate: subDays(new Date(), 5).toISOString()},
    {id: 'dist-003', enterpriseId: 'ent-001', productId: 'prod-001', employeeId: 'emp-saas-002', commissionRate: 0.08, status: 'active', assignmentDate: subDays(new Date(), 3).toISOString()},
];

export default function DistributionManagementPage() {
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(10); // Default to 10%
  const [distributionAssignments, setDistributionAssignments] = useState<SaasProductDistributionAssignment[]>([]);
  
  const [searchTermProducts, setSearchTermProducts] = useState('');
  const [searchTermEmployees, setSearchTermEmployees] = useState('');
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching or setting initial data
    if (mockEnterprises.length > 0 && !selectedEnterpriseId) {
      // setSelectedEnterpriseId(mockEnterprises[0].id); // Optionally pre-select an enterprise
    }
    setDistributionAssignments(mockInitialAssignments);
  }, [selectedEnterpriseId]);

  const availableProducts = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return mockProducts.filter(p => 
        p.enterpriseId === selectedEnterpriseId && 
        p.name.toLowerCase().includes(searchTermProducts.toLowerCase()) &&
        p.status === 'active' // Only assign active products
    );
  }, [selectedEnterpriseId, searchTermProducts]);

  const availableEmployees = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return mockEmployees.filter(e => 
        e.enterpriseId === selectedEnterpriseId &&
        e.name.toLowerCase().includes(searchTermEmployees.toLowerCase()) &&
        e.status === 'active' // Only assign to active employees
    );
  }, [selectedEnterpriseId, searchTermEmployees]);

  const getProductName = (productId: string) => mockProducts.find(p => p.id === productId)?.name || '未知商品';
  const getEmployeeName = (employeeId: string) => mockEmployees.find(e => e.id === employeeId)?.name || '未知员工';
  const getEnterpriseName = (enterpriseId: string) => mockEnterprises.find(e => e.id === enterpriseId)?.name || '未知企业';


  const handleCreateAssignments = () => {
    if (!selectedEnterpriseId) {
      toast({ title: "错误", description: "请先选择一个企业。", variant: "destructive" });
      return;
    }
    if (selectedProductIds.length === 0) {
      toast({ title: "错误", description: "请至少选择一个商品。", variant: "destructive" });
      return;
    }
    if (selectedEmployeeIds.length === 0) {
      toast({ title: "错误", description: "请至少选择一个分销人员。", variant: "destructive" });
      return;
    }
    if (commissionRate <= 0 || commissionRate > 100) {
      toast({ title: "错误", description: "提成比例必须在 1 到 100 之间。", variant: "destructive" });
      return;
    }

    const newAssignments: SaasProductDistributionAssignment[] = [];
    selectedProductIds.forEach(productId => {
      selectedEmployeeIds.forEach(employeeId => {
        // Check if this specific assignment already exists (product + employee)
        const existing = distributionAssignments.find(
          da => da.productId === productId && da.employeeId === employeeId && da.enterpriseId === selectedEnterpriseId
        );
        if (existing) {
          toast({ title: "提示", description: `商品 "${getProductName(productId)}" 已分配给员工 "${getEmployeeName(employeeId)}"。如需修改请先删除原记录。`, variant: "default", duration: 4000 });
        } else {
          newAssignments.push({
            id: `dist-${Date.now()}-${productId.slice(-3)}-${employeeId.slice(-3)}`,
            enterpriseId: selectedEnterpriseId,
            productId,
            employeeId,
            commissionRate: commissionRate / 100, // Store as decimal
            status: 'active',
            assignmentDate: new Date().toISOString(),
          });
        }
      });
    });

    if (newAssignments.length > 0) {
        setDistributionAssignments(prev => [...prev, ...newAssignments].sort((a,b) => parseISO(b.assignmentDate).getTime() - parseISO(a.assignmentDate).getTime() ));
        toast({ title: "成功", description: `已成功创建 ${newAssignments.length} 条分销分配规则。` });
    }
    
    setSelectedProductIds([]);
    setSelectedEmployeeIds([]);
    // setCommissionRate(10); // Optionally reset commission rate
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm("确定要删除此分销分配规则吗？")) {
      setDistributionAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast({ title: "删除成功", description: "分销分配规则已删除。" });
    }
  };

  const handleToggleProductSelection = (productId: string, checked: boolean) => {
    setSelectedProductIds(prev => 
      checked ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  };
  
  const handleToggleEmployeeSelection = (employeeId: string, checked: boolean) => {
    setSelectedEmployeeIds(prev =>
      checked ? [...prev, employeeId] : prev.filter(id => id !== employeeId)
    );
  };

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载销售分销管理...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Share2 className="h-6 w-6 text-primary" />
            销售分销管理
          </CardTitle>
          <CardDescription>
            将企业销售的商品分配给其员工或医生进行分销，并设置提成比例。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-lg">1. 选择操作企业</CardTitle>
        </CardHeader>
        <CardContent>
            <Select value={selectedEnterpriseId} onValueChange={(value) => {
                setSelectedEnterpriseId(value);
                setSelectedProductIds([]); // Reset selections when enterprise changes
                setSelectedEmployeeIds([]);
            }}>
                <SelectTrigger className="w-full md:w-[300px]">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                    <SelectValue placeholder="选择一个企业/医院" />
                </SelectTrigger>
                <SelectContent>
                    {mockEnterprises.map(ent => (
                        <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {!selectedEnterpriseId && <p className="text-xs text-muted-foreground mt-1">选择企业后才能进行后续操作。</p>}
        </CardContent>
      </Card>

      {selectedEnterpriseId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. 创建新的分销分配</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Selection */}
              <div>
                <Label className="text-base font-medium mb-2 block">选择商品 (多选)</Label>
                <div className="relative mb-2">
                  <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索商品名称..." value={searchTermProducts} onChange={(e) => setSearchTermProducts(e.target.value)} className="pl-8 h-9" />
                </div>
                <ScrollArea className="h-48 border rounded-md p-2">
                  {availableProducts.length > 0 ? availableProducts.map(product => (
                    <div key={product.id} className="flex items-center space-x-2 py-1.5">
                      <Checkbox 
                        id={`prod-${product.id}`} 
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={(checked) => handleToggleProductSelection(product.id, checked as boolean)}
                      />
                      <Label htmlFor={`prod-${product.id}`} className="text-sm font-normal cursor-pointer">
                        {product.name} <span className="text-xs text-muted-foreground">(¥{product.price.toFixed(2)})</span>
                      </Label>
                    </div>
                  )) : <p className="text-xs text-muted-foreground text-center py-2">该企业暂无商品或无匹配结果。</p>}
                </ScrollArea>
                <p className="text-xs text-muted-foreground mt-1">已选 {selectedProductIds.length} 个商品。</p>
              </div>

              {/* Employee Selection */}
              <div>
                <Label className="text-base font-medium mb-2 block">选择分销人员 (多选)</Label>
                <div className="relative mb-2">
                  <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索员工姓名/邮箱..." value={searchTermEmployees} onChange={(e) => setSearchTermEmployees(e.target.value)} className="pl-8 h-9" />
                </div>
                <ScrollArea className="h-48 border rounded-md p-2">
                  {availableEmployees.length > 0 ? availableEmployees.map(employee => (
                    <div key={employee.id} className="flex items-center space-x-2 py-1.5">
                      <Checkbox 
                        id={`emp-${employee.id}`} 
                        checked={selectedEmployeeIds.includes(employee.id)}
                        onCheckedChange={(checked) => handleToggleEmployeeSelection(employee.id, checked as boolean)}
                      />
                      <Label htmlFor={`emp-${employee.id}`} className="text-sm font-normal cursor-pointer">
                        {employee.name} <span className="text-xs text-muted-foreground">({employee.email})</span>
                      </Label>
                    </div>
                  )) : <p className="text-xs text-muted-foreground text-center py-2">该企业暂无员工或无匹配结果。</p>}
                </ScrollArea>
                <p className="text-xs text-muted-foreground mt-1">已选 {selectedEmployeeIds.length} 名员工。</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-grow">
                <Label htmlFor="commissionRate" className="text-sm font-medium">提成比例 (%)</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Input 
                        id="commissionRate" 
                        type="number" 
                        min="0.01" 
                        max="100" 
                        step="0.01"
                        value={commissionRate} 
                        onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)} 
                        className="w-32 h-9"
                    />
                    <Percent className="h-5 w-5 text-muted-foreground"/>
                </div>
              </div>
              <Button onClick={handleCreateAssignments} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4"/> 创建分销分配
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
            <CardTitle className="text-lg">已创建的分销规则</CardTitle>
            <CardDescription>查看和管理已设置的商品分销规则。</CardDescription>
        </CardHeader>
        <CardContent>
            {distributionAssignments.length > 0 ? (
                 <div className="overflow-x-auto border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>商品</TableHead>
                                <TableHead>分销员工</TableHead>
                                <TableHead>所属企业</TableHead>
                                <TableHead>提成比例</TableHead>
                                <TableHead>状态</TableHead>
                                <TableHead>分配日期</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {distributionAssignments.map(assign => (
                                <TableRow key={assign.id}>
                                    <TableCell className="font-medium">{getProductName(assign.productId)}</TableCell>
                                    <TableCell>{getEmployeeName(assign.employeeId)}</TableCell>
                                    <TableCell className="text-xs">{getEnterpriseName(assign.enterpriseId)}</TableCell>
                                    <TableCell>{(assign.commissionRate * 100).toFixed(2)}%</TableCell>
                                    <TableCell>
                                        <Badge variant={assign.status === 'active' ? 'default' : 'outline'} className={assign.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                            {assign.status === 'active' ? '生效中' : '已暂停'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">{format(parseISO(assign.assignmentDate), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAssignment(assign.id)} className="text-destructive hover:text-destructive h-8 px-2 text-xs">
                                            <Trash2 className="mr-1 h-3 w-3"/>删除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {distributionAssignments.length > 3 && <TableCaption>共 {distributionAssignments.length} 条分销规则。</TableCaption>}
                    </Table>
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-6 border border-dashed rounded-md">
                    暂无分销分配规则。请先选择企业并创建分配。
                </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

    