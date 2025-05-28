
'use client';

import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PackageSearch, Link as LinkIcon, UserCheck, Search, Filter } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { SaasProduct } from '@/lib/types'; // Assuming SaasProduct is relevant
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock products available to this doctor's enterprise
const mockDoctorAvailableProducts: SaasProduct[] = [
  {
    id: 'prod-doc-001',
    enterpriseId: 'ent-001', // Assume doctor belongs to ent-001
    name: '家用智能血糖仪套装',
    description: '高精度测量，附带50条试纸和采血针，蓝牙连接App。',
    category: '医疗器械',
    price: 299.00,
    stock: 120,
    status: 'active',
    images: ['https://placehold.co/300x200.png?text=血糖仪'],
    creationDate: new Date().toISOString(),
    tags: ['家庭必备', '智能检测']
  },
  {
    id: 'prod-doc-002',
    enterpriseId: 'ent-001',
    name: '糖尿病营养膳食包 (一周量)',
    description: '科学配比，低GI食材，助力稳定血糖。包含7日早中晚餐。',
    category: '膳食包',
    price: 399.00,
    stock: 50,
    status: 'active',
    images: ['https://placehold.co/300x200.png?text=膳食包'],
    creationDate: new Date().toISOString(),
    tags: ['糖尿病适用', '营养均衡']
  },
  {
    id: 'prod-doc-003',
    enterpriseId: 'ent-001',
    name: '医用级N95防护口罩 (20只)',
    description: '独立包装，有效防护病毒和颗粒物。',
    category: '防护用品',
    price: 88.00,
    stock: 300,
    status: 'active',
    images: ['https://placehold.co/300x200.png?text=N95口罩'],
    creationDate: new Date().toISOString(),
    tags: ['医用级', '防护']
  },
  {
    id: 'prod-doc-004',
    enterpriseId: 'ent-001',
    name: '便携式电子血压计',
    description: '臂式测量，大屏显示，智能加压，操作简便。',
    category: '医疗器械',
    price: 189.00,
    stock: 75,
    status: 'active',
    images: ['https://placehold.co/300x200.png?text=血压计'],
    creationDate: new Date().toISOString(),
    tags: ['血压监测', '便携']
  },
];

// Mock patient list for recommendation dialog
const mockDoctorPatients = [
  { id: "pat001", name: "张三" },
  { id: "pat002", name: "李四" },
  { id: "pat003", name: "王五" },
];


export default function DoctorProductSalesPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<SaasProduct[]>(mockDoctorAvailableProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isRecommendDialogOpen, setIsRecommendDialogOpen] = useState(false);
  const [selectedProductForRecommendation, setSelectedProductForRecommendation] = useState<SaasProduct | null>(null);
  const [selectedPatientForRecommendation, setSelectedPatientForRecommendation] = useState<string | null>(null);

  const categories = useMemo(() => {
    const catSet = new Set(mockDoctorAvailableProducts.map(p => p.category).filter(Boolean) as string[]);
    return ['all', ...Array.from(catSet)];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filterCategory === 'all' || product.category === filterCategory) &&
      product.status === 'active' // Only show active products for sale
    );
  }, [products, searchTerm, filterCategory]);

  const handleGenerateLink = (productName: string) => {
    const mockLink = `https://example.com/store/product/${productName.replace(/\s+/g, '-').toLowerCase()}`;
    navigator.clipboard.writeText(mockLink).then(() => {
      toast({
        title: "购买链接已生成 (模拟)",
        description: `商品 "${productName}" 的链接已复制到剪贴板: ${mockLink}`,
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "链接复制失败",
        description: "无法将链接复制到剪贴板，请手动复制。",
        variant: "destructive",
      });
    });
  };

  const openRecommendDialog = (product: SaasProduct) => {
    setSelectedProductForRecommendation(product);
    setSelectedPatientForRecommendation(null);
    setIsRecommendDialogOpen(true);
  };

  const handleConfirmRecommendation = () => {
    if (!selectedProductForRecommendation || !selectedPatientForRecommendation) {
      toast({ title: "请选择病人和商品", variant: "destructive" });
      return;
    }
    const patientName = mockDoctorPatients.find(p => p.id === selectedPatientForRecommendation)?.name;
    toast({
      title: "推荐已发送 (模拟)",
      description: `已向病人 "${patientName}" 推荐商品 "${selectedProductForRecommendation.name}"。`,
    });
    setIsRecommendDialogOpen(false);
    setSelectedProductForRecommendation(null);
    setSelectedPatientForRecommendation(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PackageSearch className="mr-3 h-7 w-7 text-primary" />
            商品列表与销售
          </CardTitle>
          <CardDescription>
            浏览可供推荐或销售的商品，并生成购买链接或向病人发起推荐。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-muted/20 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索商品名称或描述..."
                  className="pl-8 w-full h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="筛选分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === 'all' ? '所有分类' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-22rem)]"> {/* Adjusted height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"> {/* Changed to 3 columns for better fit */}
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    {product.images && product.images.length > 0 ? (
                      <div className="aspect-[4/3] relative w-full bg-muted">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint="product health"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center">
                        <PackageSearch className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-base font-semibold line-clamp-2" title={product.name}>{product.name}</CardTitle>
                      {product.category && <Badge variant="outline" className="text-xs mt-1">{product.category}</Badge>}
                    </CardHeader>
                    <CardContent className="p-3 pt-0 flex-grow">
                      <p className="text-lg font-bold text-primary">¥{product.price.toFixed(2)}</p>
                      {product.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{product.description}</p>}
                    </CardContent>
                    <CardFooter className="p-3 border-t flex flex-col sm:flex-row gap-2">
                      <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleGenerateLink(product.name)}>
                        <LinkIcon className="mr-1 h-3 w-3" /> 生成链接
                      </Button>
                      <Button size="sm" className="w-full text-xs" onClick={() => openRecommendDialog(product)}>
                        <UserCheck className="mr-1 h-3 w-3" /> 推荐给病人
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <PackageSearch className="mx-auto h-12 w-12 mb-2" />
              <p>暂无可销售的商品或未找到匹配项。</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRecommendDialogOpen} onOpenChange={setIsRecommendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>推荐商品给病人</DialogTitle>
            <DialogDescription>
              将商品 "{selectedProductForRecommendation?.name}" 推荐给选定的病人。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <Label htmlFor="patientSelect">选择病人</Label>
              <Select onValueChange={setSelectedPatientForRecommendation} value={selectedPatientForRecommendation || undefined}>
                <SelectTrigger id="patientSelect">
                  <SelectValue placeholder="选择一个病人" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctorPatients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">取消</Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmRecommendation} disabled={!selectedPatientForRecommendation}>确认推荐</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
