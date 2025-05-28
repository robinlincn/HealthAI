
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Flame, Tag, Award, ShoppingCart, Search, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SaasProduct } from '@/lib/types'; 
import { ProductCard } from '@/components/mall/ProductCard'; // Import ProductCard


interface MallAdBanner {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl?: string;
  dataAiHint?: string;
}

const mockAdBanners: MallAdBanner[] = [
  { id: 'banner1', imageUrl: 'https://placehold.co/600x200/008080/FFFFFF.png?text=健康生活大促销', altText: '健康生活大促销', linkUrl: '#promo1', dataAiHint: "health promotion" },
  { id: 'banner2', imageUrl: 'https://placehold.co/600x200/87CEEB/000000.png?text=新品上市+立即抢购', altText: '新品上市', linkUrl: '#new-arrivals', dataAiHint: "new product" },
];

// Mock Product Data (adapt SaasProduct or create a new type if structure differs significantly for patient view)
const mockMallProducts: SaasProduct[] = [
  { id: 'mall-prod-001', enterpriseId: 'ent-001', name: '家用智能血糖仪套装 (含50试纸)', category: '医疗器械', price: 299.00, stock: 120, status: 'active', images: ['https://placehold.co/300x300/E0F2F1/00796B.png?text=血糖仪'], creationDate: new Date().toISOString(), isHotSale: true, isDoctorRecommended: true, dataAiHint: "blood glucose meter" },
  { id: 'mall-prod-002', enterpriseId: 'ent-001', name: '高蛋白营养奶粉 (糖尿病适用)', category: '营养保健', price: 188.00, stock: 200, status: 'active', images: ['https://placehold.co/300x300/FFF9C4/FBC02D.png?text=营养奶粉'], creationDate: new Date().toISOString(), isOnSale: true, discountPrice: 168.00, dataAiHint: "protein powder" },
  { id: 'mall-prod-003', enterpriseId: 'ent-001', name: '便携式电子血压计 (臂式)', category: '医疗器械', price: 239.00, stock: 150, status: 'active', images: ['https://placehold.co/300x300/C5CAE9/3F51B5.png?text=血压计'], creationDate: new Date().toISOString(), isDoctorRecommended: true, dataAiHint: "blood pressure monitor" },
  { id: 'mall-prod-004', enterpriseId: 'ent-001', name: '无糖膳食纤维饼干 (2盒装)', category: '健康食品', price: 79.00, stock: 300, status: 'active', images: ['https://placehold.co/300x300/FFE0B2/FB8C00.png?text=无糖饼干'], creationDate: new Date().toISOString(), isHotSale: true, isOnSale: true, discountPrice: 69.00, dataAiHint: "sugar-free biscuits" },
  { id: 'mall-prod-005', enterpriseId: 'ent-001', name: '医用级一次性外科口罩 (50只)', category: '防护用品', price: 45.00, stock: 500, status: 'active', images: ['https://placehold.co/300x300/B2EBF2/00ACC1.png?text=外科口罩'], creationDate: new Date().toISOString(), tags:['日常防护'], dataAiHint: "surgical masks" },
  { id: 'mall-prod-006', enterpriseId: 'ent-001', name: '关节舒适按摩膏 (草本配方)', category: '康复理疗', price: 128.00, stock: 90, status: 'active', images: ['https://placehold.co/300x300/D1C4E9/5E35B1.png?text=按摩膏'], creationDate: new Date().toISOString(), isDoctorRecommended: true, dataAiHint: "massage cream" },
];


export default function OnlineMallPage() {
  const { toast } = useToast();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % mockAdBanners.length);
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const hotSaleProducts = mockMallProducts.filter(p => p.isHotSale && p.status === 'active');
  const onSaleProducts = mockMallProducts.filter(p => p.isOnSale && p.status === 'active');
  const doctorRecommendedProducts = mockMallProducts.filter(p => p.isDoctorRecommended && p.status === 'active');

  const handleAddToCart = (productId: string) => {
    const product = mockMallProducts.find(p => p.id === productId);
    toast({ title: `模拟加入购物车`, description: `商品 "${product?.name}" 已添加 (功能建设中)。` });
  };
  
  const handleSearch = () => {
    toast({ title: "搜索功能开发中", description: "抱歉，商品搜索功能暂未开放。" });
  };
  
  const handleCartClick = () => {
      toast({ title: "购物车功能开发中", description: "抱歉，购物车和在线支付功能正在努力建设中！" });
  };


  if (!isClient) {
    return (
        <div className="p-4 space-y-4">
            <div className="animate-pulse bg-muted h-40 w-full rounded-lg"></div>
            {[1,2,3].map(i=>(
                <div key={i} className="animate-pulse">
                    <div className="h-6 w-1/3 bg-muted rounded mb-2"></div>
                    <div className="flex space-x-3 overflow-hidden">
                        {[1,2].map(j=>(<div key={j} className="bg-muted rounded-lg w-[170px] h-[260px] flex-shrink-0"></div>))}
                    </div>
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Search and Cart Bar */}
      <div className="flex items-center gap-2 p-1 sticky top-0 bg-background/80 backdrop-blur-sm z-10 -mx-4 px-4 pb-2 border-b">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="搜索商品..." 
            className="pl-8 h-9 text-sm bg-muted" 
            onFocus={handleSearch} 
            readOnly // Since actual search is not implemented
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleCartClick}>
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">购物车</span>
        </Button>
      </div>

      {/* Ad Banner Section */}
      {mockAdBanners.length > 0 && (
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg shadow-md">
          {mockAdBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image 
                src={banner.imageUrl} 
                alt={banner.altText} 
                fill 
                sizes="100vw"
                className="object-cover" 
                data-ai-hint={banner.dataAiHint || "advertisement banner"}
              />
            </div>
          ))}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
            {mockAdBanners.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setCurrentBanner(index)}
                className={`h-1.5 w-1.5 rounded-full ${index === currentBanner ? 'bg-primary scale-125' : 'bg-white/70'}`}
                aria-label={`跳转到广告 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hot Sale Products Section */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center text-destructive"><Flame className="mr-1.5 h-5 w-5" /> 热销商品</h2>
          <Link href="#" className="text-xs text-primary hover:underline" onClick={(e) => {e.preventDefault(); toast({title:"功能建设中"})}}>查看更多 &rarr;</Link>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {hotSaleProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* On Sale Products Section */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center text-orange-500"><Tag className="mr-1.5 h-5 w-5" /> 活动商品</h2>
           <Link href="#" className="text-xs text-primary hover:underline" onClick={(e) => {e.preventDefault(); toast({title:"功能建设中"})}}>查看更多 &rarr;</Link>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {onSaleProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Doctor Recommended Products Section */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center text-blue-500"><Award className="mr-1.5 h-5 w-5" /> 医生推荐</h2>
           <Link href="#" className="text-xs text-primary hover:underline" onClick={(e) => {e.preventDefault(); toast({title:"功能建设中"})}}>查看更多 &rarr;</Link>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {doctorRecommendedProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <Card className="bg-teal-50 border-teal-200 shadow-sm">
        <CardHeader>
            <CardTitle className="text-base flex items-center text-teal-700"><Zap className="h-5 w-5 mr-2"/>特色服务与保障</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-teal-600 space-y-1">
            <p>✓ 医生参与选品，专业保障</p>
            <p>✓ 慢病适用商品，精准匹配</p>
            <p>✓ 7天无理由退换 (部分商品)</p>
        </CardContent>
      </Card>

    </div>
  );
}
