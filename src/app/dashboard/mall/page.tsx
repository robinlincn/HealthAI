
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
import { ProductCard } from '@/components/mall/ProductCard';


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

const mockMallProducts: SaasProduct[] = [
  { id: 'mall-prod-001', enterpriseId: 'ent-001', name: '家用智能血糖仪套装 (含50试纸)', description: '这款高精度家用智能血糖仪套装包含血糖仪主机一台，50条配套试纸，以及50支一次性采血针。支持蓝牙连接专属健康App，自动记录和分析血糖数据，帮助您更好地管理血糖。操作简便，读数清晰，是糖尿病患者日常监测的理想选择。', category: '医疗器械', price: 299.00, stock: 120, status: 'active', images: ['https://placehold.co/300x300/E0F2F1/00796B.png?text=血糖仪'], creationDate: new Date().toISOString(), isHotSale: true, isDoctorRecommended: true, dataAiHint: "blood glucose meter" },
  { id: 'mall-prod-002', enterpriseId: 'ent-001', name: '高蛋白营养奶粉 (糖尿病适用)', description: '专为糖尿病患者设计的高蛋白营养奶粉，采用缓释碳水化合物配方，富含多种维生素和矿物质，有助于补充营养，增强体力，同时辅助稳定血糖。口感醇厚，易于冲调。', category: '营养保健', price: 188.00, stock: 200, status: 'active', images: ['https://placehold.co/300x300/FFF9C4/FBC02D.png?text=营养奶粉'], creationDate: new Date().toISOString(), isOnSale: true, discountPrice: 168.00, dataAiHint: "protein powder" },
  { id: 'mall-prod-003', enterpriseId: 'ent-001', name: '便携式电子血压计 (臂式)', description: '臂式全自动电子血压计，采用智能加压技术，测量准确舒适。大屏幕LCD显示，读数清晰，操作简单，适合中老年人使用。支持心率不齐检测和多人数据存储。', category: '医疗器械', price: 239.00, stock: 150, status: 'active', images: ['https://placehold.co/300x300/C5CAE9/3F51B5.png?text=血压计'], creationDate: new Date().toISOString(), isDoctorRecommended: true, dataAiHint: "blood pressure monitor" },
  { id: 'mall-prod-004', enterpriseId: 'ent-001', name: '无糖膳食纤维饼干 (2盒装)', description: '精选天然谷物，富含膳食纤维，无添加蔗糖。口感酥脆，健康美味，适合作为糖尿病患者或关注健康人士的代餐或零食。独立小包装，方便携带。', category: '健康食品', price: 79.00, stock: 300, status: 'active', images: ['https://placehold.co/300x300/FFE0B2/FB8C00.png?text=无糖饼干'], creationDate: new Date().toISOString(), isHotSale: true, isOnSale: true, discountPrice: 69.00, dataAiHint: "sugar-free biscuits" },
  { id: 'mall-prod-005', enterpriseId: 'ent-001', name: '医用级一次性外科口罩 (50只)', description: '三层防护，有效过滤细菌和颗粒物，符合医用外科口罩标准。独立包装，安全卫生，佩戴舒适透气。', category: '防护用品', price: 45.00, stock: 500, status: 'active', images: ['https://placehold.co/300x300/B2EBF2/00ACC1.png?text=外科口罩'], creationDate: new Date().toISOString(), tags:['日常防护'], dataAiHint: "surgical masks" },
  { id: 'mall-prod-006', enterpriseId: 'ent-001', name: '关节舒适按摩膏 (草本配方)', description: '采用多种天然草本精华，温和渗透，有助于缓解关节不适，舒缓肌肉疲劳。适合中老年人及运动爱好者日常护理使用。', category: '康复理疗', price: 128.00, stock: 90, status: 'active', images: ['https://placehold.co/300x300/D1C4E9/5E35B1.png?text=按摩膏'], creationDate: new Date().toISOString(), isDoctorRecommended: true, dataAiHint: "massage cream" },
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
  
  const handleSearch = () => {
    toast({ title: "搜索功能开发中", description: "抱歉，商品搜索功能暂未开放。" });
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
    <div className="space-y-6 pb-4"> {/* Increased overall spacing and bottom padding */}
      {/* Search Bar - No longer sticky, part of the main flow */}
      <div className="flex items-center gap-2 pt-1"> {/* Adjusted padding */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="搜索商品、健康服务..." 
            className="pl-8 h-10 text-sm bg-muted/50 border-border/50 focus:bg-background" 
            onFocus={handleSearch} 
            readOnly
          />
        </div>
      </div>

      {/* Ad Banner Section */}
      {mockAdBanners.length > 0 && (
        <div className="relative aspect-[16/7] sm:aspect-[16/6] w-full overflow-hidden rounded-lg shadow-md">
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
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex space-x-2">
            {mockAdBanners.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentBanner ? 'bg-primary scale-125' : 'bg-primary/40 hover:bg-primary/60'}`}
                aria-label={`跳转到广告 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hot Sale Products Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-border/70">
          <h2 className="text-xl font-bold text-foreground/90 flex items-center">
            <Flame className="mr-2 h-5 w-5 text-destructive" /> 热销商品
          </h2>
          <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" onClick={(e) => {e.preventDefault(); toast({title:"功能建设中"})}}>查看更多 &rarr;</Link>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {hotSaleProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* On Sale Products Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-border/70">
          <h2 className="text-xl font-bold text-foreground/90 flex items-center">
            <Tag className="mr-2 h-5 w-5 text-orange-500" /> 活动商品
           </h2>
           <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" onClick={(e) => {e.preventDefault(); toast({title:"功能建设中"})}}>查看更多 &rarr;</Link>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {onSaleProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Doctor Recommended Products Section */}
      <section>
        <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-border/70">
          <h2 className="text-xl font-bold text-foreground/90 flex items-center">
            <Award className="mr-2 h-5 w-5 text-blue-500" /> 医生推荐
           </h2>
           <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" onClick={(e) => {e.preventDefault(); toast({title:"功能建设中"})}}>查看更多 &rarr;</Link>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {doctorRecommendedProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <Card className="bg-primary/5 border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center text-primary/90"><Zap className="h-5 w-5 mr-2"/>特色服务与保障</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-primary/80 space-y-1.5">
            <p>✓ 医生团队参与选品，专业有保障</p>
            <p>✓ 慢病适用商品筛选，精准匹配需求</p>
            <p>✓ 7天无理由退换货 (部分商品，详见说明)</p>
            <p>✓ 专属健康顾问咨询服务 (购买部分套餐)</p>
        </CardContent>
      </Card>

    </div>
  );
}

