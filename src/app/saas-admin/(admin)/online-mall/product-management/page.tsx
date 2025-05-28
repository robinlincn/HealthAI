
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductTable } from "./components/ProductTable";
import { ProductDialog } from "./components/ProductDialog";
import type { SaasProduct, SaasEnterprise, SaasProductStatus, SaasEmployee } from '@/lib/types'; // Added SaasEmployee
import { PackageSearch, PlusCircle, Search, Filter, Briefcase } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// Mock data - reuse enterprises from other pages if consistent
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

// Mock employees - ensure this list covers employees from mockEnterprises
const mockEmployees: SaasEmployee[] = [
    { id: 'emp-saas-001', enterpriseId: 'ent-001', name: '王医生 (医院A)', email: 'wang@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-saas-002', enterpriseId: 'ent-001', name: '李护士 (医院A)', email: 'li@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-saas-003', enterpriseId: 'ent-002', name: '赵顾问 (中心B)', email: 'zhao@healthb.com', status: 'active', joinDate: new Date().toISOString() },
];


const mockInitialProducts: SaasProduct[] = [
  { id: 'prod-001', enterpriseId: 'ent-001', name: '智能血糖仪套装', description: '包含血糖仪、试纸50条、采血针。', category: '医疗器械', price: 299.00, stock: 150, status: 'active', images: ['https://placehold.co/300x200.png?text=血糖仪'], creationDate: new Date().toISOString(), sku: 'XM-BG-001', tags: ['血糖监测', '家庭用'], assignedEmployeeIds: ['emp-saas-001'] },
  { id: 'prod-002', enterpriseId: 'ent-001', name: '控糖膳食营养包 (7日)', description: '科学配比，助力血糖管理。', category: '膳食包', price: 199.00, stock: 80, status: 'active', images: ['https://placehold.co/300x200.png?text=膳食包'], creationDate: new Date().toISOString(), sku: 'KT-MEAL-007', assignedEmployeeIds: ['emp-saas-001', 'emp-saas-002'] },
  { id: 'prod-003', enterpriseId: 'ent-002', name: '养心安神药膳包', description: '精选草本，辅助调理。', category: '药膳包', price: 99.00, stock: 200, status: 'draft', images: ['https://placehold.co/300x200.png?text=药膳包'], creationDate: new Date().toISOString(), assignedEmployeeIds: ['emp-saas-003'] },
  { id: 'prod-004', enterpriseId: 'ent-001', name: '医用N95口罩 (50只装)', description: '防护升级，关爱健康。', category: '防护用品', price: 75.00, stock: 500, status: 'active', images: ['https://placehold.co/300x200.png?text=口罩'], creationDate: new Date().toISOString(), sku: 'MASK-N95-50' },
];


export default function ProductManagementPage() {
  const [products, setProducts] = useState<SaasProduct[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SaasProduct | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterpriseId, setFilterEnterpriseId] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<SaasProductStatus | "all">("all");
  
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setProducts(mockInitialProducts);
  }, []);

  const categories = useMemo(() => {
    const allCategories = new Set(products.map(p => p.category).filter(Boolean) as string[]);
    return Array.from(allCategories);
  }, [products]);

  const handleAddProduct = () => {
    if (mockEnterprises.length === 0) {
        toast({ title: "请先创建企业", description: "商品必须关联到一个企业账户。", variant: "destructive"});
        return;
    }
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: SaasProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('确定要删除此商品吗？此操作不可撤销。')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: '删除成功', description: '商品已删除。' });
    }
  };
  
  const handleToggleProductStatus = (productId: string) => {
     setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        let newStatus: SaasProductStatus = 'draft';
        if (p.status === 'draft') newStatus = 'active';
        else if (p.status === 'active') newStatus = 'archived'; // Cycle: draft -> active -> archived -> draft
        else if (p.status === 'archived') newStatus = 'draft';
        return { ...p, status: newStatus };
      }
      return p;
    }));
    toast({ title: '状态已更新', description: `商品状态已切换。` });
  };

  const handleDialogSubmit = (data: SaasProduct) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => (p.id === editingProduct.id ? data : p)));
      toast({ title: '更新成功', description: `商品 "${data.name}" 信息已更新。`});
    } else {
      const newProductWithDate = { ...data, creationDate: new Date().toISOString() };
      setProducts(prev => [newProductWithDate, ...prev]);
      toast({ title: '创建成功', description: `新商品 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const enterpriseMatch = filterEnterpriseId === "all" || product.enterpriseId === filterEnterpriseId;
      const categoryMatch = filterCategory === "all" || product.category === filterCategory;
      const statusMatch = filterStatus === "all" || product.status === filterStatus;
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return enterpriseMatch && categoryMatch && statusMatch && searchMatch;
    });
  }, [products, searchTerm, filterEnterpriseId, filterCategory, filterStatus]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>商品管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载商品数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PackageSearch className="h-6 w-6 text-primary" />
            商品管理
          </CardTitle>
          <CardDescription>
            管理在线商城中的商品信息，包括添加、编辑、删除商品，设置价格、库存、上下架、分配销售人员等。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="lg:col-span-2">
                <Label htmlFor="productSearch" className="sr-only">搜索商品</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      id="productSearch" type="search" placeholder="商品名称, SKU, 描述..."
                      className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterEnterpriseId} onValueChange={setFilterEnterpriseId}>
                  <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>企业</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有企业</SelectItem>{mockEnterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>分类</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有分类</SelectItem>{categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasProductStatus | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>状态</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="active">已上架</SelectItem>
                      <SelectItem value="draft">草稿(下架)</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
              </Select>
              <div className="lg:col-start-4 flex justify-end">
                <Button onClick={handleAddProduct} className="w-full lg:w-auto"><PlusCircle className="mr-2 h-4 w-4"/> 添加商品</Button>
              </div>
            </div>
          </div>
          
          <ProductTable 
            products={filteredProducts} 
            enterprises={mockEnterprises}
            onEdit={handleEditProduct} 
            onDelete={handleDeleteProduct}
            onToggleStatus={handleToggleProductStatus}
          />
        </CardContent>
      </Card>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingProduct(null); }}
        onSubmit={handleDialogSubmit}
        product={editingProduct}
        enterprises={mockEnterprises}
        allEmployees={mockEmployees} 
      />
    </div>
  );
}

