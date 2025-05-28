
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Star, Tag, ShieldCheck, Flame, Truck, Heart, CreditCard } from "lucide-react"; // Added Heart, CreditCard
import type { SaasProduct } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from '@/lib/cartStore';
import { cn } from "@/lib/utils"; // Ensure cn is imported

// Re-using mock product data from mall/page.tsx for simplicity.
const mockMallProducts: SaasProduct[] = [
  { id: 'mall-prod-001', enterpriseId: 'ent-001', name: '家用智能血糖仪套装 (含50试纸)', description: '这款高精度家用智能血糖仪套装包含血糖仪主机一台，50条配套试纸，以及50支一次性采血针。支持蓝牙连接专属健康App，自动记录和分析血糖数据，帮助您更好地管理血糖。操作简便，读数清晰，是糖尿病患者日常监测的理想选择。', category: '医疗器械', price: 299.00, stock: 120, status: 'active', images: ['https://placehold.co/600x400/E0F2F1/00796B.png?text=血糖仪+大图', 'https://placehold.co/300x200/E0F2F1/00796B.png?text=细节1', 'https://placehold.co/300x200/E0F2F1/00796B.png?text=细节2'], creationDate: new Date().toISOString(), isHotSale: true, isDoctorRecommended: true, dataAiHint: "blood glucose meter" },
  { id: 'mall-prod-002', enterpriseId: 'ent-001', name: '高蛋白营养奶粉 (糖尿病适用)', description: '专为糖尿病患者设计的高蛋白营养奶粉，采用缓释碳水化合物配方，富含多种维生素和矿物质，有助于补充营养，增强体力，同时辅助稳定血糖。口感醇厚，易于冲调。适合作为日常营养补充或特定时期的营养支持。', category: '营养保健', price: 188.00, stock: 200, status: 'active', images: ['https://placehold.co/600x400/FFF9C4/FBC02D.png?text=营养奶粉+大图'], creationDate: new Date().toISOString(), isOnSale: true, discountPrice: 168.00, dataAiHint: "protein powder" },
  { id: 'mall-prod-003', enterpriseId: 'ent-001', name: '便携式电子血压计 (臂式)', description: '臂式全自动电子血压计，采用智能加压技术，测量准确舒适。大屏幕LCD显示，读数清晰，操作简单，适合中老年人使用。支持心率不齐检测和多人数据存储。附带便携收纳袋。', category: '医疗器械', price: 239.00, stock: 150, status: 'active', images: ['https://placehold.co/600x400/C5CAE9/3F51B5.png?text=血压计+大图'], creationDate: new Date().toISOString(), isDoctorRecommended: true, dataAiHint: "blood pressure monitor" },
  { id: 'mall-prod-004', enterpriseId: 'ent-001', name: '无糖膳食纤维饼干 (2盒装)', description: '精选天然谷物，富含膳食纤维，无添加蔗糖。口感酥脆，健康美味，适合作为糖尿病患者或关注健康人士的代餐或零食。每盒独立小包装，方便携带和控制食用量。', category: '健康食品', price: 79.00, stock: 300, status: 'active', images: ['https://placehold.co/600x400/FFE0B2/FB8C00.png?text=无糖饼干+大图'], creationDate: new Date().toISOString(), isHotSale: true, isOnSale: true, discountPrice: 69.00, dataAiHint: "sugar-free biscuits" },
  { id: 'mall-prod-005', enterpriseId: 'ent-001', name: '医用级一次性外科口罩 (50只)', description: '三层防护结构，BFE（细菌过滤效率）≥95%，有效过滤细菌和颗粒物，符合医用外科口罩标准 YY 0469-2011。独立包装，安全卫生，佩戴舒适透气，耳带弹性适中。', category: '防护用品', price: 45.00, stock: 500, status: 'active', images: ['https://placehold.co/600x400/B2EBF2/00ACC1.png?text=外科口罩+大图'], creationDate: new Date().toISOString(), tags:['日常防护', '医用标准'], dataAiHint: "surgical masks" },
  { id: 'mall-prod-006', enterpriseId: 'ent-001', name: '关节舒适按摩膏 (草本配方)', description: '采用多种天然草本精华，如红花、当归、伸筋草等，结合现代工艺提取。温和渗透，不油腻，有助于缓解关节不适，舒缓因运动或劳损引起的肌肉疲劳。适合中老年人及运动爱好者日常关节护理使用。', category: '康复理疗', price: 128.00, stock: 90, status: 'active', images: ['https://placehold.co/600x400/D1C4E9/5E35B1.png?text=按摩膏+大图'], creationDate: new Date().toISOString(), isDoctorRecommended: true, dataAiHint: "massage cream" },
];


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const addItemToCart = useCartStore((state) => state.addItem);
  const [isFavorited, setIsFavorited] = useState(false); // State for favorite button

  useEffect(() => {
    setIsClient(true);
    if (params.productId) {
      const foundProduct = mockMallProducts.find(p => p.id === params.productId);
      setProduct(foundProduct || null);
      setSelectedImageIndex(0);
      // In a real app, you might fetch favorite status from backend or localStorage
      // For now, it resets on each product load
      setIsFavorited(false); 
    }
  }, [params.productId]);

  const handleAddToCart = () => {
    if (product) {
      addItemToCart(product);
      toast({
        title: "已加入购物车",
        description: `${product.name} 已添加到您的购物车。`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItemToCart(product); // Add to cart first
      toast({
        title: "直接购买 (模拟)",
        description: `商品 "${product.name}" 已加入购物车，即将跳转到结算页面。`,
      });
      router.push('/dashboard/mall/checkout');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: !isFavorited ? "已收藏" : "已取消收藏",
      description: product ? `商品 "${product.name}" ${!isFavorited ? '已添加到收藏夹' : '已从收藏夹移除'}。` : "操作成功。",
    });
  };
  
  if (!isClient) {
    return (
        <div className="p-4 space-y-4">
            <div className="animate-pulse bg-muted h-10 w-32 rounded mb-4"></div>
            <div className="animate-pulse bg-muted aspect-square w-full rounded-lg mb-4"></div>
            <div className="animate-pulse bg-muted h-8 w-3/4 rounded mb-2"></div>
            <div className="animate-pulse bg-muted h-6 w-1/2 rounded mb-4"></div>
            <div className="animate-pulse bg-muted h-20 w-full rounded mb-4"></div>
            <div className="animate-pulse bg-muted h-12 w-full rounded"></div>
        </div>
    );
  }


  if (!product) {
    return (
      <div className="p-4 text-center">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 self-start">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回商城
        </Button>
        <p className="text-muted-foreground">商品未找到或加载失败。</p>
      </div>
    );
  }

  const displayPrice = product.isOnSale && typeof product.discountPrice === 'number' 
    ? product.discountPrice 
    : product.price;
  const originalPrice = product.isOnSale && typeof product.discountPrice === 'number' && product.price > product.discountPrice
    ? product.price
    : null;

  return (
    <div className="pb-4">
      <Card className="overflow-hidden shadow-none border-0 md:border md:shadow-sm">
        {product.images && product.images.length > 0 && (
          <div className="relative aspect-square w-full bg-muted">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-contain" 
              priority
              data-ai-hint={product.dataAiHint || "product detail image"}
            />
          </div>
        )}
        {product.images && product.images.length > 1 && (
          <ScrollArea className="w-full whitespace-nowrap py-2 border-b">
            <div className="flex space-x-2 px-2">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all 
                              ${index === selectedImageIndex ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent hover:border-muted-foreground/50'}`}
                >
                  <Image src={imgUrl} alt={`${product.name} - 缩略图 ${index + 1}`} width={64} height={64} className="object-cover h-full w-full" />
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
           <div className="flex flex-wrap gap-2 mt-1">
              {product.category && <Badge variant="secondary" className="text-xs">{product.category}</Badge>}
              {product.isHotSale && <Badge variant="outline" className="text-xs border-orange-500 text-orange-600"><Flame className="h-3 w-3 mr-1"/>热销</Badge>}
              {product.isOnSale && <Badge variant="outline" className="text-xs border-red-500 text-red-600"><Tag className="h-3 w-3 mr-1"/>活动</Badge>}
              {product.isDoctorRecommended && <Badge variant="outline" className="text-xs border-blue-500 text-blue-600"><Star className="h-3 w-3 mr-1"/>医生推荐</Badge>}
            </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">¥{displayPrice.toFixed(2)}</p>
            {originalPrice && (
              <p className="text-sm text-muted-foreground line-through">¥{originalPrice.toFixed(2)}</p>
            )}
          </div>

          {product.description && (
            <div>
              <h4 className="text-sm font-semibold mb-1 text-foreground/80">商品详情</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
          
          {product.tags && product.tags.length > 0 && (
             <div className="pt-2">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">标签:</h4>
                <div className="flex flex-wrap gap-1.5">
                    {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                </div>
            </div>
          )}
        </CardContent>
        <CardContent className="border-t pt-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full h-11 text-base flex-1" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 加入购物车
              </Button>
              <Button 
                size="lg" 
                className="w-full h-11 text-base flex-1 bg-primary hover:bg-primary/90" 
                onClick={handleBuyNow}
              >
                <CreditCard className="mr-2 h-5 w-5" /> 直接购买
              </Button>
            </div>
            <Button 
              variant="ghost" 
              className="w-full h-11 text-base text-muted-foreground hover:text-primary"
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("mr-2 h-5 w-5", isFavorited && "fill-destructive text-destructive")} /> 
              {isFavorited ? '已收藏' : '收藏商品'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            <ShieldCheck className="inline h-3 w-3 mr-1 text-green-600"/> 正品保障 ·
            <Truck className="inline h-3 w-3 ml-1.5 mr-1 text-blue-600"/> 快速发货
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
    

    