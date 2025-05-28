
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import type { SaasProductCategory, SaasEnterprise } from '@/lib/types';
import { ListFilter, PlusCircle, Search } from "lucide-react";
import { CategoryTable } from './components/CategoryTable';
import { CategoryDialog } from './components/CategoryDialog';

const mockInitialCategories: SaasProductCategory[] = [
  { id: 'cat-001', name: '医疗器械', description: '各种家用和专业医疗检测、治疗设备。', creationDate: new Date().toISOString(), productCount: 5 },
  { id: 'cat-002', name: '膳食包', description: '针对不同健康需求的预制膳食套餐。', creationDate: new Date().toISOString(), productCount: 3 },
  { id: 'cat-003', name: '药膳包', description: '基于中医理论的调理药膳。', creationDate: new Date().toISOString(), productCount: 7 },
  { id: 'cat-004', name: '康复用具', description: '辅助病人康复的各种器具。', creationDate: new Date().toISOString(), productCount: 2 },
  { id: 'cat-005', name: '保健品', description: '营养补充剂和功能性保健食品。', creationDate: new Date().toISOString(), productCount: 10 },
];

// Assume enterprises are loaded from a shared source or context in a real app
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];


export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<SaasProductCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SaasProductCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCategories(mockInitialCategories);
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: SaasProductCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('确定要删除此商品分类吗？如果分类下有商品，将无法删除。')) {
      // Mock check: in a real app, check if products use this category
      const isCategoryInUse = false; // Replace with actual check
      if (isCategoryInUse) {
        toast({ title: '删除失败', description: '此分类下仍有商品，无法删除。', variant: 'destructive' });
        return;
      }
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      toast({ title: '删除成功', description: '商品分类已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasProductCategory) => {
    if (editingCategory) {
      setCategories(prev => prev.map(c => (c.id === editingCategory.id ? { ...c, ...data, productCount: c.productCount } : c)));
      toast({ title: '更新成功', description: `分类 "${data.name}" 信息已更新。`});
    } else {
      const newCategory = { ...data, id: `cat-${Date.now()}`, creationDate: new Date().toISOString(), productCount: 0 };
      setCategories(prev => [newCategory, ...prev]);
      toast({ title: '创建成功', description: `新分类 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>商品分类管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载分类数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ListFilter className="h-6 w-6 text-primary" />
            商品分类管理
          </CardTitle>
          <CardDescription>
            管理在线商城的商品分类信息，包括添加、编辑、删除分类。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索分类名称或描述..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddCategory} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> 新增分类
            </Button>
          </div>
          
          <CategoryTable 
            categories={filteredCategories} 
            onEdit={handleEditCategory} 
            onDelete={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingCategory(null); }}
        onSubmit={handleDialogSubmit}
        category={editingCategory}
      />
    </div>
  );
}
